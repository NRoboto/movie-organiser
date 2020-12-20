import mongoose from "mongoose";

export const checkRequiredForDoc = <T extends {}>(
  Model: mongoose.Model<mongoose.Document, {}>,
  modelDoc: T
) => async (isRequired: boolean, field: keyof T) => {
  const { [field]: _, ...doc } = modelDoc;

  if (isRequired) await expect(new Model(doc).save()).rejects.toThrow();
  else await expect(new Model(doc).save()).resolves.toMatchObject(doc);
};

export const writeWithDoc = <T extends {}>(
  Model: mongoose.Model<mongoose.Document, {}>,
  modelDoc: T
) => async (fieldReplacements?: { [x: string]: any }) => {
  const doc = {
    ...modelDoc,
    ...fieldReplacements,
  };

  return await new Model(doc).save();
};
