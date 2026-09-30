document.addEventListener("DOMContentLoaded", () => {
  const containerCards = document.getElementById("container-cards");

  const URL_API = "http://localhost:3000/api/cardapio";

  async function carregarCardapio() {
    try {
      const resposta = await fetch(URL_API);
      const cafes = await resposta.json();

      // Limpa o container
      containerCards.innerHTML = "";

      // Percorre a lista recebida do backend e cria o HTML para cada item
      cafes.forEach((cafe) => {
        const card = document.createElement("article");
        card.classList.add("card");

        // Formata o preço para o padrão brasileiro (ex: R$ 8,50)
        const precoFormatado = cafe.preco 
          ? `R$ ${Number(cafe.preco).toFixed(2).replace(".", ",")}` 
          : "Preço sob consulta";

        card.innerHTML = `
          <img src="${cafe.imagem}" alt="${cafe.nome}" />
          <h3>${cafe.nome}</h3>
          <p>${cafe.descricao}</p>
          <p class="preco">${precoFormatado}</p>
          <button>Pedir Agora</button>
        `;

        containerCards.appendChild(card);
      });
    } catch (erro) {
      console.error("Erro ao carregar o cardápio:", erro);
      containerCards.innerHTML = "<p>Não foi possível carregar o cardápio no momento.</p>";
    }
  }

  carregarCardapio();
});