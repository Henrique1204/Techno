const vm = new Vue({
    el: '#App',
    data: {
        carrinho: [],
        produtos: [],
        produto: null,
        mensagemAlerta: '',
        carrinhoAtivo: false
    },
    filters: {
        numeroPreco(preco) {
            return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
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
        fecharModalEsc({ key }) {
            if (key === 'Escape') {
                this.produto = null;
                window.removeEventListener('keyup', this.fecharModalEsc);
            }
        },
        abrirModal(id) {
            this.fetchProduto(id);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            window.addEventListener('keyup', this.fecharModalEsc);
        },
        adicionarItem() {
            this.produto.estoque--;

            const { id, nome, preco } = this.produto;

            this.carrinho.push({ id, nome, preco });
            this.ativarAlerta(`${nome} adicionado ao carrinho.`);
        },
        fecharModal({ target, currentTarget }) {
            if (target === currentTarget) this.produto = null;
            window.removeEventListener('keyup', this.fecharModalEsc);
        },
        removerItem(ini) {
            this.carrinho.splice(ini, 1);
            this.ativarAlerta('Item removido com sucesso!');
        },
        checarLocalStorage() {
            if (window.localStorage.carrinho) {
                this.carrinho = JSON.parse(window.localStorage.carrinho);
            }
        },
        compararEstoque() {
            const itens = this.carrinho.filter(({ id }) => id === this.produto.id);
            this.produto.estoque -= itens.length;
        },
        ativarAlerta(mensagem) {
            this.mensagemAlerta = mensagem;
            setTimeout(() => (this.mensagemAlerta = ''), 1500);
        },
        router() {
            const hash = document.location.hash;
            if (hash) this.fetchProduto(hash.replace('#', ''));
        },
        abrirModalCarrinho() {
            this.carrinhoAtivo = true;
            window.addEventListener('keyup', this.fecharModalCarrinhoEsc);
        },
        fecharModalCarrinhoEsc({ key }) {
            if (key === 'Escape') {
                this.carrinhoAtivo = false;
                window.removeEventListener('keyup', this.fecharModalCarrinhoEsc);
            }
        },
        fecharModalCarrinho({ target, currentTarget }) {
            if (target === currentTarget) this.carrinhoAtivo = false;
            window.removeEventListener('keyup', this.fecharModalCarrinhoEsc);
        },
    },
    watch: {
        produto() {
            document.title = this.produto?.nome || 'Techno';
            const hash = this.produto?.id || '';
            history.pushState(null, null, `#${hash}`);

            if (this.produto) {
                this.compararEstoque();
            }
        },
        carrinho() {
            window.localStorage.carrinho = JSON.stringify(this.carrinho);
        }
    },
    created() {
        this.fetchProdutos();
        this.router();
        this.checarLocalStorage();
    }
});
