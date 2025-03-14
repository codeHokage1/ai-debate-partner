interface UploadBlobResponse {
  success: boolean;
  message: string;
}

export async function uploadBlob(
  audioBlob: Blob,
  fileType: string,
): Promise<UploadBlobResponse> {
  const formData = new FormData();
  formData.append('audio_data', audioBlob, 'file');
  formData.append('type', fileType || 'mp3');

  // Your server endpoint to upload audio:
  const apiUrl = 'http://localhost:3000/upload/audio';

  const response = await fetch(apiUrl, {
    method: 'POST',
    cache: 'no-cache',
    body: formData,
  });

  return response.json();
}
