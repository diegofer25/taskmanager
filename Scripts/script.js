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
    .controller('CategoryController', CategoryController)
    .controller('IndexController', IndexController);

function TaskController($http) {
    let self = this;
    self.status = stats;
    self.tarefas = [];
    console.log(self.tarefas);
    $http.get('http://taskmanager-api.azurewebsites.net/api/Taskmanager')
      .then(function(result) {
        result.data.forEach(t => {
            self.tarefas.push(t);
        });
    });
    console.log(self.tarefas);
    self.checkInput = checkInput;
    self.cadTask = cadTask;
    self.removeTask = removeTask;
    self.showdash = statustarefa.initChartist;
}

function CategoryController() {
    let self = this;
    self.categorias = category;
    self.verify = verify;
    self.addCategoria = addCategoria;
    self.removeCategoria = removeCategoria;
    self.eraseInput = eraseInput;
}

function IndexController() {
    let self = this;
    self.year = (new Date()).getFullYear();
}

function cadTask(tInput, cInput, tlist) {
    let info = $('#button-info');
    let submit = $('#button-submit');
    if (tInput && tlist) {
        tlist.push({
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

function removeTask(tlist, key) {
    let info = $('#button-info');
    if (confirm(`Deseja mesmo excluir a tarefa "${tlist[key].nome}"`)) {
        tlist.splice(key, 1);
        info.attr('class', 'btn btn-danger col-sm-12');
        info.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
    }
}

function checkInput(tInput, tlist, cInput) {
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
            tlist.forEach(t => {
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

let stats = [
    { nome: false },
    { nome: true }
];

let category = [
    { nome: 'Casa' },
    { nome: 'Trabalho' },
    { nome: 'Faculdade' }
];

function addCategoria(cat, categorias) {
    let but = $('#button-status');
    if (cat && categorias) {
        categorias.push({ nome: cat });
        but.attr('class', 'btn btn-success col-sm-8 mb-2 mb-sm-0');
        but.html('<span class="fa fa-check-circle"> Categoria cadastrada com sucesso</span>');
        $('#button-submit').attr('class', 'd-none');
    }
}

function removeCategoria(list, key) {
    let but = $('#button-status');
    let status = $('#status-remove');
    if (confirm(`Deseja mesmo excluir a categoria "${list[key].nome}"`)) {
        list.splice(key, 1);
        but.html('<span class="fa fa-info-circle"> Cadastre aqui uma nova Categoria</span>');
        but.attr('class', 'btn btn-info col-sm-8 mb-2 mb-sm-0');
        status.attr('class', 'btn btn-danger col-sm-12');
        status.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
    }
}

function verify(cat, categorias, def) {
    let status = $('#status-remove');
    let confirm = $('#button-submit');
    let but = $('#button-status');
    let exist = false;
    if (def == false) {
        if (cat && cat != '' && categorias) {
            let str = String(cat).toLocaleLowerCase();
            str = str[0].toUpperCase() + "" + str.slice(1, str.length);
            categorias.forEach(categoria => {
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

function eraseInput() {
    $('#user-input').val('');
}

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
        let dash = $('#dashstatus');
        if(dash){
            Chartist.Pie('#dashstatus', {
            labels: [`${parseInt((concluidas / total) * 100)}%`, `${parseInt((pendentes / total) * 100)}%`],
            series: [(concluidas / total) * 100, (pendentes / total) * 100]
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
            let dashcats = $(`#${c.nome}`);
            if(dashcats){
                Chartist.Pie(`#${c.nome}`, {
                labels: [`${parseInt((concluidas / total) * 100)}%`, `${parseInt((pendentes / total) * 100)}%`],
                series: [(concluidas / total) * 100, (pendentes / total) * 100]});
            }
        });
    }
}