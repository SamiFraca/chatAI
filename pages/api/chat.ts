import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }
  try {
    const response = await axios.post('https://api-inference.huggingface.co/models/EleutherAI/gpt-neox-20b', {
      inputs: message,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
    });

    res.status(200).json({ message: response.data[0].generated_text });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ error: error });
  }
}
