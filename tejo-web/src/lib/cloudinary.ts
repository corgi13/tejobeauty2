export function getUnsignedUploadUrl() {
  const cloud = process.env.NEXT_PUBLIC_IMAGE_CDN?.split('/')[2]?.split('.')[0] || 'demo';
  return `https://api.cloudinary.com/v1_1/${cloud}/auto/upload`;
}


