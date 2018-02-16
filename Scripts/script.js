$(document).ready(function () {
    let time = setInterval(() => {
        $('#menu-toggle').trigger('click');
        clearInterval(time);
    }, 300);
    $("#menu-toggle").click(function (e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});

angular.module("app", [])
    .controller('TaskController', TaskController)
    .controller('CategoryController', CategoryController);

function TaskController() {
    let self = this;
    self.checkInput = checkInput;
    self.cadTask = cadTask;
    self.removeTask = removeTask;
    self.showdash = statustarefa.initChartist;
    self.status = stats = [{ nome: false },{ nome: true }];
    self.tarefas = taks = [
    { nome: 'Varrer o quarto', categoria: 'Casa', feito: false },
    { nome: 'Lavar a louça', categoria: 'Casa', feito: true },
    { nome: 'Lavar as roupas', categoria: 'Casa', feito: false },
    { nome: 'Consertar a porta', categoria: 'Casa', feito: false },
    { nome: 'Terminar o relatório', categoria: 'Trabalho', feito: false },
    { nome: 'Estudar para a próxima reunião', categoria: 'Trabalho', feito: false },
    { nome: 'Enviar email sobre o problema', categoria: 'Trabalho', feito: false },
    { nome: 'Levar pó de café', categoria: 'Trabalho', feito: true },
    { nome: 'Comprar canetas novas', categoria: 'Trabalho', feito: true },
    { nome: 'Estudar Etapa 1', categoria: 'Faculdade', feito: true },
    { nome: 'Estudar Etapa 2', categoria: 'Faculdade', feito: true },
    { nome: 'Estudar Etapa 3', categoria: 'Faculdade', feito: false },
    { nome: 'Fazer TP1', categoria: 'Faculdade', feito: false }
    ];
    
    function cadTask(tInput, cInput) {
        let info = $('#button-info');
        let submit = $('#button-submit');
        if (tInput) {
            self.tarefas.push({
                nome: tInput,
                categoria: cInput,
                feito: false
            });
            submit.attr('class', 'd-none');
            $('.form-inline').css('border', 'none');
            info.attr('class', 'btn btn-success col-sm-12');
            info.html('<span class="fa fa-check-circle"> Tarefa cadastrada com sucesso</span>');
        }
    }
    
    function removeTask(key) {
        let info = $('#button-info');
        if (confirm(`Deseja mesmo excluir a tarefa "${tlist[key].nome}"`)) {
            self.tarefas.splice(key, 1);
            info.attr('class', 'btn btn-danger col-sm-12');
            info.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
        }
    }
    
    function checkInput(tInput, cInput) {
        $('.form-inline').css('border', 'none');
        let info = $('#button-info');
        let submit = $('#button-submit');
        if (cInput) {
            $('.btn-group').css('border', 'none');
            let aux = false;
            if (tInput) {
                let inputLow = String(tInput).toLocaleLowerCase();
                aux = true;
                $('#user-input').css('border', 'none');
                self.tarefas.forEach(t => {
                    let tLow = String(t.nome).toLocaleLowerCase();
                    if (tLow == inputLow) {
                        if (t.categoria == cInput) {
                            aux = false;
                            submit.attr('class', 'd-none');
                            info.attr('class', 'btn btn-warning col-sm-12');
                            info.html(`<span class="fa fa-warning"></span> Essa tarefa já está cadastrada nesta categoria`);
                            $('.form-inline').css('border', 'solid orange 1px');
                        }
                    }
                });
                if (aux) {
                    info.attr('class', 'd-none');
                    submit.attr('class', 'btn btn-success col-sm-12');
                    $('.form-inline').css('border', 'solid lightgreen 2px');
                }
            } else {
                submit.attr('class', 'd-none');
                info.attr('class', 'btn btn-warning col-sm-12');
                info.html(`<span class="fa fa-warning"></span> Por favor informe o nome da tarefa`);
                $('#user-input').css('border', '2px orange solid');
            }
        } else {
            submit.attr('class', 'd-none');
            info.attr('class', 'btn btn-warning col-sm-12');
            info.html(`<span class="fa fa-warning"></span> Por favor selecione uma categoria`);
            $('.btn-group').css('border', '2px orange solid');
        }
    }
}

function CategoryController() {
    let self = this;
    self.categorias = category = [
    { nome: 'Casa' },
    { nome: 'Trabalho' },
    { nome: 'Faculdade' }
    ];
    self.verify = verify;
    self.addCategoria = addCategoria;
    self.removeCategoria = removeCategoria;
    self.eraseInput = eraseInput;
    
    function addCategoria(cat) {
        let but = $('#button-status');
        if (cat) {
            self.categorias.push({ nome: cat });
            but.attr('class', 'btn btn-success col-sm-8 mb-2 mb-sm-0');
            but.html('<span class="fa fa-check-circle"> Categoria cadastrada com sucesso</span>');
            $('#button-submit').attr('class', 'd-none');
        }
    }
    
    function removeCategoria(key) {
        let but = $('#button-status');
        let status = $('#status-remove');
        if (confirm(`Deseja mesmo excluir a categoria "${self.categorias[key].nome}"`)) {
            self.categorias.splice(key, 1);
            but.html('<span class="fa fa-info-circle"> Cadastre aqui uma nova Categoria</span>');
            but.attr('class', 'btn btn-info col-sm-8 mb-2 mb-sm-0');
            status.attr('class', 'btn btn-danger col-sm-12');
            status.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
        }
    }
    
    function verify(cat, def) {
        let status = $('#status-remove');
        let confirm = $('#button-submit');
        let but = $('#button-status');
        let exist = false;
        if (def == false) {
            if (cat && cat != '') {
                let str = String(cat).toLocaleLowerCase();
                str = str[0].toUpperCase() + "" + str.slice(1, str.length);
                self.categorias.forEach(categoria => {
                    if (categoria.nome == str) {
                        exist = true;
                        but.attr('class', 'btn-warning btn col-sm-8 mb-2 mb-sm-0');
                        but.html('<span class="fa fa-warning"> Categoria já cadastrada</span>');
                        confirm.attr('class', 'd-none');
                    }
                });
            }
            if (cat == '') {
                but.attr('class', 'btn-warning btn col-sm-8 mb-2 mb-sm-0');
                but.html('<span class="fa fa-warning"> Não é possível cadastrar Categorias em branco</span>');
                confirm.attr('class', 'd-none');
            }
            if (cat && exist == false) {
                but.attr('class', 'd-none');
                confirm.attr('class', 'btn btn-success col-sm-8 mb-2 mb-sm-0');
                status.attr('class', 'd-none');
            }
        } else {
            confirm.attr('class', 'd-none');
        }
    }
}

function eraseInput() {
    $('#user-input').val('');
}

(function(){
    window.PLOTLYENV={'BASE_URL': 'https://plot.ly'};
    
    var gd = document.getElementById('944c6d9b-3d65-40d9-9d22-c50a1ca40c93')
    var resizeDebounce = null;
    
    function resizePlot() {
        var bb = gd.getBoundingClientRect();
        Plotly.relayout(gd, {
            width: bb.width,
            height: bb.height
        });
    }
}());

let statustarefa = {
    initChartist: function (taks, cats) {

        let total = taks.length;
        let pendentes = 0;
        let concluidas = 0;
        taks.forEach(t => {
            if (t.feito) {
                concluidas++;
            } else {
                pendentes++;
            }
        });
        let dashstatus = $('#dashstatus');
        if(dashstatus){
            Plotly.newPlot('dashstatus', {
                data: [{"sort": true, "opacity": 0.9, "direction": "counterclockwise", "uid": "151083", "labelssrc": "diegofer25:2:371d18", "labels": [`Concluídas: ${parseInt((concluidas / total) * 100)}%`,`Pendentes: ${parseInt((pendentes / total) * 100)}%`], "values": [parseInt((concluidas / total) * 100), parseInt((pendentes / total) * 100)], "hoverinfo": "label", "marker": {"line": {"color": "rgb(140, 0, 0)"}, "colors": ["rgb(190, 207, 182)", "rgb(125, 178, 143)", "rgb(40, 144, 126)", "rgb(16, 125, 121)", "rgb(24, 97, 108)", "rgb(28, 71, 93)"]}, "textinfo": "percent", "type": "pie", "valuessrc": "diegofer25:2:b759c3", "name": "values"}],
                layout: {"autosize": false, "font": {"family": "Roboto"}, "title": "<b>An\u00e1lise de Tarefas por Status<\/b>", "paper_bgcolor": "rgb(255, 255, 255)", "hiddenlabels": [], "height": 300, "width": 300, "titlefont": {"family": "Roboto"}, "hovermode": "closest", "breakpoints": [{"frame": "workspace-breakpoint-0", "type": "width", "range": [0, 300]}], "margin": {"r": 80, "b": 60, "l": 70, "t": 120}, "legend": {"y": 1.423148148148148, "x": 0.02194324194324196}},
                frames: [{"data": [], "layout": {"autosize": false, "title": "<b>An\u00e1lise de Tarefas por Status<\/b>", "paper_bgcolor": "rgb(255, 255, 255)", "height": 300, "width": 300, "titlefont": {"family": "Roboto"}, "hovermode": "closest", "font": {"family": "Roboto"}, "margin": {"pad": 0, "r": 60, "b": 0, "l": 40, "t": 80}, "legend": {"y": 1.1814814814814816, "x": 0.1310341510341511, "font": {"color": "rgb(0, 0, 0)"}, "borderwidth": 0, "bordercolor": "rgb(0, 0, 0)"}}, "name": "workspace-breakpoint-0"}],
                config: {"mapboxAccessToken": "pk.eyJ1IjoiY2hyaWRkeXAiLCJhIjoiY2lxMnVvdm5iMDA4dnhsbTQ5aHJzcGs0MyJ9.X9o_rzNLNesDxdra4neC_A", "linkText": "Export to plot.ly", "showLink": true, staticPlot: true}
            });
        }
        
        cats.forEach(c => {
            pendentes = 0;
            concluidas = 0;
            total = 0;
            taks.forEach(t => {
                if (t.feito && t.categoria == c.nome) {
                    concluidas++;
                    total++;
                } else if (t.categoria == c.nome && t.feito == false) {
                    pendentes++;
                    total++;
                }
            });
        });
    }
}