import numpy as np
from PIL import Image, ImageDraw
import scipy.interpolate as interp
import json
import numpy.matlib
import itertools
import pandas as pd


def interpolate(data, precision, method="linear", mn=None, mx=None, internal=False, multiplier=1):
    data = np.asarray(data)
    dataMulti = data

    if multiplier != 1:
        dataMulti = data * multiplier

    if mn is None or mx is None:
        mn, mx = dataMulti.min(axis=0), dataMulti.max(axis=0)

    mn = precision * (10 * mn / (precision * 10)).astype(int)
    mx = precision * (10 * mx / (precision * 10)).astype(int)

    xm = np.arange(mn[0], mx[0] + precision, precision)
    ym = np.arange(mn[1], mx[1] + precision, precision)

    x, y = np.meshgrid(xm, ym)
    z = interp.griddata(dataMulti[:, 0:2], dataMulti[:, 2], (x, y), method=method)

    xyz = data
    xyzi = [x, y, z, xm, ym]

    if internal == False:
        val = np.nanmin(xyzi[2])
        xyz, xyzi = normalize_z_axis(xyz, xyzi, val)

        jsonArray = {}
        jsonArray[0] = xyzi[0].tolist()
        jsonArray[1] = xyzi[1].tolist()
        jsonArray[2] = xyzi[2].tolist()
        jsonArray[3] = xyzi[3].tolist()
        jsonArray[4] = xyzi[4].tolist()
        jsonArray[5] = xyz.tolist()

        return json.dumps(jsonArray)

    if internal:
        return xyzi


def interpolate3D(xyz):
    xyz = np.asarray(xyz)

    # create meshgrid for 3d plot
    # min and max values per column
    mn = xyz.min(axis=0)
    mx = xyz.max(axis=0)

    gridsize = 300

    xm, ym = np.meshgrid(np.linspace(mn[0], mx[0], gridsize), np.linspace(mn[1], mx[1], gridsize))
    grid_locations = np.vstack((xm.ravel(), ym.ravel())).T  # flatten to pass to griddata method
    Z = interp.griddata(xyz[:, [0, 1]], xyz[:, 2], grid_locations, method='nearest')  # interpolate to the smaller grid
    Z = Z.reshape(xm.shape)

    jsonArray = {}
    jsonArray[0] = xm.tolist()
    jsonArray[1] = ym.tolist()
    jsonArray[2] = Z.tolist()

    return json.dumps(jsonArray)


def autoRotateCreatePanel(xyz):
    xyz = np.asarray(xyz)

    c = np.nanmean(xyz, axis=0)
    c = np.matlib.repmat(c, xyz.shape[0], 1)
    data = xyz - c
    eig = np.linalg.eig(np.dot(np.transpose(data), data))

    # numpy does not automatically order the eigenvectors.
    # We need to order them from the one corresponding to the max eigen value and descending
    order = np.argsort(eig[0])[::-1]
    PCs = np.vstack((eig[1][:, order[0]], eig[1][:, order[1]], eig[1][:, order[2]]))

    c = np.nanmean(xyz, axis=0)
    c = np.matlib.repmat(c, xyz.shape[0], 1)
    rotated_xyz = c + np.dot((xyz - c), np.transpose(PCs))

    jsonArray = {}
    jsonArray[0] = rotated_xyz.tolist()

    return json.dumps(jsonArray)


def autoRotate(xyz, precision):
    # eigenvectors cannot be calculated when there are NaN-s in the image.
    # We replace them with maximal value
    xyz = np.asarray(xyz)
    toRotate = xyz
    nanIndices = np.where(np.isnan(toRotate))  # TODO: exception here, needs to be fixed
    toRotate[nanIndices] = np.nanmax(toRotate[:, 2])

    c = np.nanmean(xyz, axis=0)
    c = np.matlib.repmat(c, xyz.shape[0], 1)
    data = xyz - c

    nanIndices = np.where(np.isnan(data))
    data[nanIndices] = np.nanmax(data)

    eig = np.linalg.eig(np.dot(np.transpose(data), data))

    # numpy does not automatically order the eigenvectors.
    # We need to order them from the one corresponding to the max eigen value and descending
    order = np.argsort(eig[0])[::-1]

    PCs = np.vstack((eig[1][:, order[0]], eig[1][:, order[1]], eig[1][:, order[2]]))

    c = np.nanmean(toRotate, axis=0)
    c = np.matlib.repmat(c, toRotate.shape[0], 1)
    rotated_xyz = c + np.dot((toRotate - c), np.transpose(PCs))

    rotated_x, rotated_y, rotated_z, rotated_xm, rotated_ym = interpolate(rotated_xyz, precision, "linear", None, None,
                                                                          True)
    rotated_xyzi = (rotated_x, rotated_y, rotated_z, rotated_xm, rotated_ym)

    rotated_xyz, rotated_xyzi = normalize_z_axis(rotated_xyz, rotated_xyzi, np.nanmin(rotated_xyzi[2]))

    jsonArray = {}
    jsonArray[0] = rotated_xyzi[0].tolist()
    jsonArray[1] = rotated_xyzi[1].tolist()
    jsonArray[2] = rotated_xyzi[2].tolist()
    jsonArray[3] = rotated_xyzi[3].tolist()
    jsonArray[4] = rotated_xyzi[4].tolist()
    jsonArray['rotated_xyz'] = rotated_xyz.tolist()

    return json.dumps(jsonArray)


def rotate90(data, precision):
    data = np.asarray(data)

    rotated_z = np.rot90(data[2])

    data[0] = np.asarray(data[0])
    data[1] = np.asarray(data[1])

    xm = np.arange(data[0][0, 0], data[0][0, 0] + (data[0].shape[0] - 1) * precision + precision, precision)
    ym = np.arange(data[1][0, 0], data[1][0, 0] + (data[1].shape[1] - 1) * precision + precision, precision)

    rotated_x, rotated_y = np.meshgrid(xm, ym)

    # create 1d arrays for the matplot
    x_1d = np.reshape(rotated_x, rotated_x.shape[0] * rotated_x.shape[1], 1)
    y_1d = np.reshape(rotated_y, rotated_y.shape[0] * rotated_y.shape[1], 1)
    z_1d = np.reshape(rotated_z, rotated_z.shape[0] * rotated_z.shape[1], 1)

    rotated_xyz = np.transpose(np.vstack((x_1d, y_1d, z_1d)))
    rotated_xyzi = (rotated_x, rotated_y, rotated_z, xm, ym)

    jsonArray = {}
    jsonArray["xyz"] = rotated_xyz.tolist()
    jsonArray[0] = rotated_xyzi[0].tolist()
    jsonArray[1] = rotated_xyzi[1].tolist()
    jsonArray[2] = rotated_xyzi[2].tolist()
    jsonArray[3] = rotated_xyzi[3].tolist()
    jsonArray[4] = rotated_xyzi[4].tolist()

    return json.dumps(jsonArray)


def mirror(data):
    data = np.asarray(data)

    data[0] = np.asarray(data[0])
    data[1] = np.asarray(data[1])
    data[2] = np.asarray(data[2])
    data[3] = np.asarray(data[3])
    data[4] = np.asarray(data[4])

    mirrored_z = np.flip(data[2], axis=1)

    # create 1d arrays for the matplot
    x_1d = np.reshape(data[0], data[0].shape[0] * data[0].shape[1], 1)
    y_1d = np.reshape(data[1], data[1].shape[0] * data[1].shape[1], 1)
    z_1d = np.reshape(mirrored_z, mirrored_z.shape[0] * mirrored_z.shape[1], 1)

    mirrored_xyz = np.transpose(np.vstack((x_1d, y_1d, z_1d)))

    jsonArray = {}
    jsonArray["xyz"] = mirrored_xyz.tolist()
    jsonArray[0] = data[0].tolist()
    jsonArray[1] = data[1].tolist()
    jsonArray[2] = mirrored_z.tolist()
    jsonArray[3] = data[3].tolist()
    jsonArray[4] = data[4].tolist()

    return json.dumps(jsonArray)


def contour(xyzi1, xyzi2, landmarks1, landmarks2, line, triangle, circle, transformation, contourLines):
    xyzi1 = json.loads(xyzi1)
    xyzi2 = json.loads(xyzi2)
    landmarks1 = json.loads(landmarks1)
    landmarks2 = json.loads(landmarks2)

    xyzi1 = np.asarray(xyzi1)
    xyzi1[0] = np.asarray(xyzi1[0])
    xyzi1[1] = np.asarray(xyzi1[1])
    xyzi1[2] = np.asarray(xyzi1[2])
    xyzi1[3] = np.asarray(xyzi1[3])
    xyzi1[4] = np.asarray(xyzi1[4])
    xyzi2 = np.asarray(xyzi2)
    xyzi2[0] = np.asarray(xyzi2[0])
    xyzi2[1] = np.asarray(xyzi2[1])
    xyzi2[2] = np.asarray(xyzi2[2])
    xyzi2[3] = np.asarray(xyzi2[3])
    xyzi2[4] = np.asarray(xyzi2[4])
    landmarks1 = np.asarray(landmarks1)
    landmarks2 = np.asarray(landmarks2)

    nan_mask = ~np.isnan(landmarks1[:, 0])

    if np.sum(nan_mask) > 2 and landmarks2.shape[0] == landmarks1.shape[0]:

        # geometric landmarks
        lm_master_g = np.empty([0, 2])
        lm_source_g = np.empty([0, 2])

        if line == 1:
            for val in itertools.combinations(np.arange(0, landmarks1.shape[0], 1), 2):
                lm_master_g = np.vstack((lm_master_g, landmarks1[val, :].mean(axis=0, keepdims=True)))
                lm_source_g = np.vstack((lm_source_g, landmarks2[val, :].mean(axis=0, keepdims=True)))

        if triangle == 1:
            for val in itertools.combinations(np.arange(0, landmarks1.shape[0], 1), 3):
                lm_master_g = np.vstack((lm_master_g, landmarks1[val, :].mean(axis=0, keepdims=True)))
                lm_source_g = np.vstack((lm_source_g, landmarks2[val, :].mean(axis=0, keepdims=True)))

        if circle == 1:
            for val in itertools.combinations(np.arange(0, landmarks1.shape[0], 1), 4):
                lm_master_g = np.vstack((lm_master_g, landmarks1[val, :].mean(axis=0, keepdims=True)))
                lm_source_g = np.vstack((lm_source_g, landmarks2[val, :].mean(axis=0, keepdims=True)))

        # transform landmark coordinates (0..X, 0..Y) to interpolated coordinates
        xm = xyzi1[3]
        ym = xyzi1[4]
        z = xyzi1[2]
        Y = landmarks1[nan_mask, :].astype(int)
        levels1 = z[Y[:, 1], Y[:, 0]]
        Y = np.vstack((Y, lm_master_g.astype(int)))
        Y = np.hstack((xm[Y[:, 0], None], ym[Y[:, 1], None]))

        xm = xyzi2[3]
        ym = xyzi2[4]
        z = xyzi2[2]
        X = landmarks2[nan_mask, :].astype(int)
        levels2 = z[X[:, 1], X[:, 0]]
        X = np.vstack((X, lm_source_g.astype(int)))
        X = np.hstack((xm[X[:, 0], None], ym[X[:, 1], None], np.ones((X.shape[0], 1))))

        for i in range(contourLines):
            levels1 = intrp(levels1)
            levels2 = intrp(levels2)

        levels1.sort(axis=0)
        levels2.sort(axis=0)

        # build a regression model to find optimal (in the MSE sense) linear transformation S->T
        if transformation == 0:

            centrX, centrY = np.zeros((1, 3)), np.zeros((1, 3))
            A = np.dot(np.dot(np.linalg.inv(np.dot(np.transpose(X), X)), np.transpose(X)), Y)

        # rigid transformation https://github.com/charnley/rmsd
        else:

            # optimal translation - move center of gravity to the origin
            centrX = X[:, 0:2].mean(axis=0, keepdims=True)
            centrY = Y.mean(axis=0, keepdims=True)

            C = np.dot(np.transpose(X[:, 0:2] - centrX), Y - centrY)
            V, S, W = np.linalg.svd(C)
            VW = np.dot(V, W)
            A = np.vstack((VW, centrY - np.dot(centrX, VW)))

        (xyzi, Tsav) = transform(xyzi2, A)
        err = np.sqrt((((Y[0:np.sum(nan_mask), :] - np.dot(X[0:np.sum(nan_mask), :], A)) ** 2).sum(axis=1).mean()))

        jsonArray = {}
        jsonArray[0] = err.tolist()
        jsonArray[1] = xyzi[0].tolist()
        jsonArray[2] = xyzi[1].tolist()
        jsonArray[3] = xyzi[2].tolist()
        jsonArray[4] = levels1.tolist()
        jsonArray[5] = levels2.tolist()
        jsonArray[6] = A.tolist()

        return json.dumps(jsonArray)


def intrp(l_in):
    l_in = l_in.astype(float)
    l_out = np.zeros(shape=(2 * len(l_in) + 1, 1), dtype=float)
    l_out[0] = l_in[0] - (l_in[1] - l_in[0]) / 2

    for i in range(len(l_in) - 1):
        l_out[1 + 2 * i] = l_in[i]
        l_out[2 + 2 * i] = (l_in[i] + l_in[i + 1]) / 2

    l_out[-2] = l_in[-1]
    l_out[-1] = l_in[-1] + (l_in[-1] - l_in[-2]) / 2

    l_out = np.squeeze(np.asarray(l_out))

    return l_out


def statistics(models, precision, scale):
    models = json.loads(models)
    models = np.asarray(models)

    models[0] = np.asarray(models[0])
    models[0][0][0] = np.asarray(models[0][0][0])
    models[0][0][1] = np.asarray(models[0][0][1])
    models[0][0][2] = np.asarray(models[0][0][2])
    models[0][0][3] = np.asarray(models[0][0][3])
    models[0][0][4] = np.asarray(models[0][0][4])
    models[0][1] = np.asarray(models[0][1])

    models[1] = np.asarray(models[1])
    models[1][0][0] = np.asarray(models[1][0][0])
    models[1][0][1] = np.asarray(models[1][0][1])
    models[1][0][2] = np.asarray(models[1][0][2])
    models[1][0][3] = np.asarray(models[1][0][3])
    models[1][0][4] = np.asarray(models[1][0][4])
    models[1][1] = np.asarray(models[1][1])

    # go through all registered prints and calculate statistics
    T_all = []
    mn, mx = np.empty((0, 2)), np.empty((0, 2))

    for mpl in models:
        if mpl[1] is not None:
            (xyzi, T) = transform(mpl[0], mpl[1])
            T_all.append(T)
            mn = np.vstack((mn, np.min(T[:, 0:2], axis=0)))
            mx = np.vstack((mx, np.max(T[:, 0:2], axis=0)))

    mn, mx = np.max(mn, axis=0), np.min(mx, axis=0)

    result = {}
    result[0] = interpolate(T_all[0], precision, mn=mn, mx=mx, internal=True)
    result[1] = interpolate(T_all[1], precision, mn=mn, mx=mx, internal=True)

    X, Y = np.hstack(result[0][0]), np.hstack(result[0][1])
    Z = np.empty((0, result[0][2].size))

    Z = np.vstack((Z, np.hstack(result[0][2])))
    Z = np.vstack((Z, np.hstack(result[1][2])))

    mask = ~np.any(np.isnan(Z), axis=0)

    jsonArray = []
    stat_names = ['mean', 'median', 'std', 'min', 'max', 'ptp', 'var_outlier_2sd', 'var_outlier_3sd']

    for name in stat_names:

        if name == 'var_outlier_2sd':
            stat_vals = variance_outliers(2, Z[:, mask])
        elif name == 'var_outlier_3sd':
            stat_vals = variance_outliers(3, Z[:, mask])
        else:
            cmd = 'stat_vals = np.' + name + '(Z[:, mask], axis=0)'
            exec(cmd)
        data = np.transpose(np.vstack((X[mask], Y[mask], stat_vals)))
        jsonArray.append(data.tolist())

    # Mean plot
    mean_Z = 0
    cmd = 'mean_Z = np.mean(Z, axis=0)'
    exec(cmd)
    xyz = np.vstack((X, Y, mean_Z))
    xyz = xyz.transpose()
    xyzi_xx = result[0][0]
    xyzi_yy = result[0][1]
    xyzi_zz = np.reshape(mean_Z, (result[0][0].shape[0], result[0][0].shape[1]))
    xyzi_x = X
    xyzi_y = Y
    xyzi = (xyzi_xx, xyzi_yy, xyzi_zz, xyzi_x, xyzi_y)
    xyz, xyzi = normalize_z_axis(xyz, xyzi, np.nanmin(xyzi[2]))

    jsonArray.append(xyz.tolist())
    jsonArray.append(xyzi[0].tolist())
    jsonArray.append(xyzi[1].tolist())
    jsonArray.append(xyzi[2].tolist())
    jsonArray.append(xyzi[3].tolist())
    jsonArray.append(xyzi[4].tolist())
    jsonArray.append(T_all[0].tolist())
    jsonArray.append(T_all[1].tolist())

    return json.dumps(jsonArray)


def depthChart(xyzi, landmarks):
    xyzi = json.loads(xyzi)
    landmarks = json.loads(landmarks)

    xyzi = np.asarray(xyzi)
    xyzi[0] = np.asarray(xyzi[0])
    xyzi[1] = np.asarray(xyzi[1])
    xyzi[2] = np.asarray(xyzi[2])
    landmarks = np.asarray(landmarks)

    depth_values = np.empty(0)
    depth_coords = np.empty((0, 2))
    x = xyzi[0]
    y = xyzi[1]
    z = xyzi[2]

    for i in range(0, landmarks.shape[0] - 1):
        img = Image.new('L', (xyzi[0].shape[1], xyzi[0].shape[0]), 0)
        ImageDraw.Draw(img).line(tuple(map(tuple, landmarks[i:i + 2, :])), width=1, fill=1)
        maskLine = np.asarray(img)
        maskLine = (maskLine == 1)
        iIdxRows, iIdxCols = np.where(maskLine)
        iX = x[iIdxRows.astype(int), iIdxCols.astype(int)]
        iY = y[iIdxRows.astype(int), iIdxCols.astype(int)]
        iValues = z[iIdxRows.astype(int), iIdxCols.astype(int)]

        # check which point was the start of the line, and if needed swap the line coordinates
        if iIdxRows[-1] == landmarks[i, 1] and iIdxCols[-1] == landmarks[i, 0]:
            iValues = np.flipud(iValues)
            iX = np.flipud(iX)
            iY = np.flipud(iY)

        depth_values = np.hstack((depth_values, iValues))
        depth_coords = np.vstack((depth_coords, np.vstack((iX, iY)).transpose()))

    graph_depth_coords_values = np.hstack((depth_coords, np.expand_dims(depth_values.transpose(), axis=1)))

    jsonArray = {}
    jsonArray[0] = graph_depth_coords_values.tolist()
    jsonArray[1] = depth_values.tolist()

    return json.dumps(jsonArray)


def transform(xyzi, A):
    x = np.reshape(xyzi[0], (xyzi[0].size, 1))
    y = np.reshape(xyzi[1], (xyzi[1].size, 1))
    S1 = np.hstack((x, y, np.ones((x.size, 1))))
    T = np.dot(S1, A)
    xyzi_out = np.reshape(T[:, 0], xyzi[0].shape), np.reshape(T[:, 1], xyzi[1].shape), xyzi[2]
    Tsav = np.hstack((T, np.reshape(xyzi[2], (T.shape[0], 1))))
    Tsav = Tsav[~pd.isnull(Tsav).any(axis=1)]

    return (xyzi_out, Tsav)


def variance_outliers(mult, data):
    var = np.var(data, axis=0)
    mean = np.mean(var)
    sd = np.std(var)

    u = np.where(var > mean + mult * sd)
    u = np.hstack((u, np.where(var < mean - mult * sd)))

    out = var
    out[u] = 0
    mask = np.ones(len(out), np.bool)
    mask[u] = 0
    out[mask] = 1

    return out


def normalize_z_axis(xyz, xyzi, val):
    dif = np.hstack((np.zeros((xyz.shape[0], 2)), np.zeros((xyz.shape[0], 1)) + val))
    xyzi = (xyzi[0], xyzi[1], xyzi[2] - val, xyzi[3], xyzi[4])
    xyz = xyz - dif

    return xyz, xyzi
