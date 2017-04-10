def cleanDict(dict):
    for key in dict:
        if dict[key] is None:
            dict[key] = 0

    return dict