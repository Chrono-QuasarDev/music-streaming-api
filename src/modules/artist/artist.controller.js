import { getArtist, followArtist } from "./artist.service.js";

export const artist = async (req, res) => {
  const { id } = req.params;
  const artist = await getArtist(id);

  return res.status(200).json({
    success: true,
    data: artist
  });
}

export const follow = async (req, res) => {
  const artistId = req.params.id;
  const userId = req.user.id;

  // Implementation for following an artist
  await followArtist(artistId, userId);

  return res.status(200).json({
    success: true,
    message: 'Artist followed successfully'
  });
}