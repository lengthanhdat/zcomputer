import { Request, Response } from "express";
import Setting from "../models/Setting";

export const getSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const setting = await Setting.findOne({ key });
    if (!setting) return res.json({ value: null });
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: "Error fetching setting" });
  }
};

export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    let { value } = req.body;
    
    // Auto increment version for popup announcement if contents change
    if (key === 'popup_announcement') {
      const existing = await Setting.findOne({ key });
      const currentVersion = existing?.value?.version || 0;
      
      // We always increment version when updating so that users will see it again,
      // unless isActive is just being toggled off (frontend can pass a flag or we just increment anyway).
      // Let's just always increment version so the latest save is always shown if active.
      if (typeof value === 'object') {
        value.version = currentVersion + 1;
      }
    }

    const setting = await Setting.findOneAndUpdate(
      { key },
      { value },
      { new: true, upsert: true }
    );
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ message: "Error updating setting" });
  }
};
