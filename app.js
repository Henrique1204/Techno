const vm = new Vue({
    el: '#App',
    data: {
        produtos: []
    },
    methods: {
        async fetchProdutos() {
            const res = await fetch('./api/produtos.json');
            this.produtos = await res.json();
        }
    },
    created() {
        this.fetchProdutos();
    }
});
