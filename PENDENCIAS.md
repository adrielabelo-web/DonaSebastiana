# PENDÊNCIAS · site da Dona Sebastiana

O site está pronto para publicar. Saiu do modo rascunho em 22/11/2026 e pode aparecer no Google.

## Como está
- Vende só o caderninho, a R$ 9,90. Todos os botões levam para `https://pay.kiwify.com.br/kX2Z2YT`.
- Os outros cadernos não aparecem na página. As ofertas extras ficam por conta do checkout.

## Para conferir quando der
- **Garantia:** o site diz 7 dias, o mínimo por lei em compra pela internet. Se na Kiwify o prazo for maior, trocar no `index.html` (seção "A palavra da vó" e última pergunta das dúvidas).
- **Números:** "70 mil seguidores no Instagram" e "7 milhões de visualizações no Facebook" vieram do briefing, de novembro de 2026. Atualizar quando mudarem.
- **Redes:** os botões de Instagram, Facebook e TikTok ficam escondidos enquanto `REDES`, no topo do `main.js`, estiver vazio. É só preencher que eles aparecem.
- **Receitas por parte:** a seção "Dentro do caderninho" não mostra a quantidade de cada parte. Com o PDF do caderninho dá para contar e preencher.
- **Imagem de compartilhamento:** quando houver domínio, trocar o `og:image` do `index.html` pelo endereço completo.
- **Imagens:** a capa do caderninho ainda é um recorte em baixa resolução, e a vó está de azul-marinho (o briefing sugere azul-claro).

## Para olhar no checkout da Kiwify
- O contador de "oferta por tempo limitado" reinicia a cada visita.
- Um depoimento assinado "João da Silva" fala em "+ de 250 receitas", e o caderninho tem mais de 500.
- O texto dos 4 cadernos diz "separados custam R$ 39,60". Conferir se a soma fecha com o preço da Ceia.

## O que ficou de fora de propósito
- Depoimentos, antes e depois, promessa de saúde, biografia inventada e urgência falsa.
- Pixel: nenhum instalado. O `main.js` já dispara `InitiateCheckout` se houver Pixel e repassa as UTMs para o checkout.
- A linha de personagem de IA continua no rodapé.