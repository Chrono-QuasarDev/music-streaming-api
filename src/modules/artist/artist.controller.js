import { getArtist } from "./artist.service.js";

export const artist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const artist = await getArtist(id);

    return res.status(200).json({
      success: true,
      data: artist
    });
  } catch (error) {
    next(error);
  }
}