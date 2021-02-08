const vm = new Vue({
    el: '#App',
    data: {
        carrinho: [],
        produtos: [],
        produto: null
    },
    filters: {
        numeroPreco(preco) {
            return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
        }
    },
    computed: {
        carrinhoTotal() {
            return this.carrinho.map(({ preco }) => preco)
            .reduce((ant, atual) => (ant + atual), 0);
        }
    },
    methods: {
        async fetchProdutos() {
            const res = await fetch('./api/produtos.json');
            this.produtos = await res.json();
        },
        async fetchProduto(id) {
            const res = await fetch(`./api/produtos/${id}/dados.json`);
            this.produto = await res.json();
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        },
        adicionarItem() {
            this.produto.estoque--;

            const { id, nome, preco } = this.produto;

            this.carrinho.push({ id, nome, preco });
        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = null;
        },
        removerItem(ini) {
            this.carrinho.splice(ini, 1);
        }
    },
    created() {
        this.fetchProdutos();
    }
});
