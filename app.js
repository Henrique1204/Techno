const vm = new Vue({
    el: '#App',
    data: {
        produtos: [],
        produto: null
    },
    filters: {
        numeroPreco(preco) {
            return preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
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
        }
    },
    created() {
        this.fetchProdutos();
    }
});
