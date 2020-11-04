"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeWithDoc = exports.checkRequiredForDoc = void 0;
exports.checkRequiredForDoc = (Model, modelDoc) => async (isRequired, field) => {
    const { [field]: _, ...doc } = modelDoc;
    if (isRequired)
        await expect(new Model(doc).save()).rejects.toThrow();
    else
        await expect(new Model(doc).save()).resolves.toMatchObject(doc);
};
exports.writeWithDoc = (Model, modelDoc) => async (fieldReplacements) => {
    const doc = {
        ...modelDoc,
        ...fieldReplacements,
    };
    return await new Model(doc).save();
};
