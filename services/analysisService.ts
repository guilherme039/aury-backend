export const analyzeFoodImage = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("https://aury-backend.onrender.com/analisar-imagem", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Erro ao analisar imagem");

  return await response.json();
};
