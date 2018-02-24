let sessionName = sessionStorage.getItem('sessionName');
let sessionId = sessionStorage.getItem('sessionId');
let page = window.location.pathname;

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
    .controller('RouterController', RouterController)
    .controller('TaskController', TaskController)
    .controller('CategoryController', CategoryController)
    .controller('UserController', UserController);
    
function RouterController(){
    let self = this;
    self.checkSession = checkSession;
    self.index = index;
    
    function checkSession(check){
        if(sessionName && sessionId){
            
        }else if(check){
            window.location.assign("../sessionerror.html");
        }
    }
    
    function index(){
        window.location.assign("../index.html");
    }
}

function UserController($http, $window) {
    let self = this;
    self.name = sessionName;
    self.id = sessionId;
    self.cadUser = cadUser;

    function cadUser(name, email, password, fbfoto) {
        if (nome && email && password) {
            document.getElementById("overlay").style.display = "block";
            let foto = "../images/profile.png";
            if (fbfoto) {
                foto = fbfoto;
            }
            $http({
                "method": "POST",
                "async": true,
                "crossDomain": true,
                "url": "http://taskmanager-api.azurewebsites.net/api/User",
                "headers": {
                    "content-type": "application/json"
                },
                "processData": false,
                "data": {
                    "nome": name,
                    "email": email,
                    "senha": password,
                    "foto": foto
                }
            }
            ).then(function (response) {
                sessionStorage.setItem('sessionName', response.data.nome);
                sessionStorage.setItem('sessionId', response.data.id);
                $window.location.href = 'WebView/HomeIndex.html';
            }).catch(function (response) {
                console.log("Put Fail: " + response.data);
                document.getElementById("overlay").style.display = "none";
                $("#registerstatus").attr("class","btn btn-warning col-12");
                $("#registerstatus").text(' E-mail já cadastrado no sistema');
                $("#registerstatus>span").attr("class","fa fa-warning");
            });
        }
    }
}

function TaskController($http) {
    let self = this;
    self.status = stats;
    self.tarefas = [];
    $http.get('http://taskmanager-api.azurewebsites.net/api/Task')
      .then(function(result) {
        result.data.forEach(t => {
            self.tarefas.push(t);
        });
    });
    self.checkInput = checkInput;
    self.cadTask = cadTask;
    self.removeTask = removeTask;
    self.showdash = showdash;
    self.flagTask = flagTask;
    
    function cadTask(tInput, cInput, tlist) {
        let info = $('#button-info');
        let submit = $('#button-submit');
        if (tInput && tlist) {
            
            $http({
              "method": "POST",
              "async": true,
              "crossDomain": true,
              "url": "http://taskmanager-api.azurewebsites.net/api/task",
              "headers": {
                "content-type": "application/json",
              },
              "processData": false,
              "data": {
                    nome: tInput,
                    categoria: cInput,
                    feito: false
                  }
            }).then(function (response) {
              self.categorias.push({ nome: cat });
              console.log("Post Success");
            })
            .catch(function(){
                console.log("Post Fail");
            });
            
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
    
    function removeTask(tlist, key, id) {
        let info = $('#button-info');
        if (confirm(`Deseja mesmo excluir a tarefa "${tlist[key].nome}"`)) {
            
            $http({
              "method": "DELETE",
              "async": true,
              "crossDomain": true,
              "url": `http://taskmanager-api.azurewebsites.net/api/task/${id}`,
            }).then(function (response) {
            	console.log("Delete Success");
                tlist.splice(key, 1);
            })
            .catch(function(){
            	console.log("Delete Fail");
            });
            
            info.attr('class', 'btn btn-danger col-sm-12');
            info.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
        }
    }
    
    function flagTask(isdo, key, id){
        
        $http({
          "method": "PUT",
          "async": true,
          "crossDomain": true,
          "url": `http://taskmanager-api.azurewebsites.net/api/task/${id}`,
          "headers": {
            "content-type": "application/json",
          },
          "processData": false,
          "data": {feito:isdo}
        }).then(function (response) {
            self.tarefas[key].feito = isdo;
        	console.log("Put Success");
        })
        .catch(function(){
        	console.log("Put Fail");
        });
    }
}

function CategoryController($http) {
    let self = this;
    self.categorias = [];
    $http.get('http://taskmanager-api.azurewebsites.net/api/Category')
      .then(function(result) {
        result.data.forEach(c => {
            self.categorias.push(c);
        });
    });
    self.verify = verify;
    self.addCategoria = addCategoria;
    self.removeCategoria = removeCategoria;
    self.eraseInput = eraseInput;
    
    function addCategoria(cat, categorias) {
        let but = $('#button-status');
        if (cat && categorias) {
            
            $http({
              "method": "POST",
              "async": true,
              "crossDomain": true,
              "url": "http://taskmanager-api.azurewebsites.net/api/category",
              "headers": {
                "content-type": "application/json",
              },
              "processData": false,
              "data": { nome : cat }
            }).then(function (response) {
              self.categorias.push({ nome: cat });
              console.log("Post Success");
            })
            .catch(function(){
                console.log("Post Fail");
            });
            
            but.attr('class', 'btn btn-success col-sm-8 mb-2 mb-sm-0');
            but.html('<span class="fa fa-check-circle"> Categoria cadastrada com sucesso</span>');
            $('#button-submit').attr('class', 'd-none');
        }
    }

    function removeCategoria(list, key, id) {
        let but = $('#button-status');
        let status = $('#status-remove');
        if (confirm(`Deseja mesmo excluir a categoria "${list[key].nome}"`)) {
            
            $http({
              "method": "DELETE",
              "async": true,
              "crossDomain": true,
              "url": `http://taskmanager-api.azurewebsites.net/api/category/${id}`,
            }).then(function (response) {
            	console.log("Delete Success");
                list.splice(key, 1);
            })
            .catch(function(){
            	console.log("Delete Fail");
            });
            
            but.html('<span class="fa fa-info-circle"> Cadastre aqui uma nova Categoria</span>');
            but.attr('class', 'btn btn-info col-sm-8 mb-2 mb-sm-0');
            status.attr('class', 'btn btn-danger col-sm-12');
            status.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
        }
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


function showdash(taks, cats) {
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
    if(dash && total != 0){
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
        if(dashcats && total != 0){
            Chartist.Pie(`#${c.nome}`, {
            labels: [`${parseInt((concluidas / total) * 100)}%`, `${parseInt((pendentes / total) * 100)}%`],
            series: [(concluidas / total) * 100, (pendentes / total) * 100]});
        }
    });
}