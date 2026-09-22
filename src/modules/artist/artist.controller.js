import { getArtist, followArtist } from "./artist.service.js";

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

export const follow = async (req, res, next) => {
  try {
    const artistId = req.params.id;
    const userId = req.user.id;

    // Implementation for following an artist
    await followArtist(artistId, userId);

    return res.status(200).json({
      success: true,
      message: 'Artist followed successfully'
    });
  } catch (error) {
    next(error);
  }
}