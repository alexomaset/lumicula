import { put } from '@vercel/blob';
import { del } from '@vercel/blob';

export async function uploadImage(file: File) {
  try {
    const { url } = await put(file.name, file, {
      access: 'public',
    });
    return url;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}

export async function deleteImage(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error('Error deleting image:', error);
  }
}