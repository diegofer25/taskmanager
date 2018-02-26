let sessionName = sessionStorage.getItem('sessionName');
let sessionId = sessionStorage.getItem('sessionId');
let sessionPhoto = sessionStorage.getItem('sessionPhoto');

$(document).ready(function () {
    if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
        let time = setInterval(() => {
        $('#menu-toggle').trigger('click');
        clearInterval(time);
        }, 300);
    }
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
    self.year = (new Date()).getFullYear();
    self.titleIndex = "Login";
    self.titleRegister = "Cadastro";
    self.titleSessionError = "Seção expirada";
    self.titleHome = "Home";
    self.titleTasks = "Gerenciar Tarefas";
    self.titleCats = "Gerenciar Categorias";
    self.checkSession = checkSession;
    self.index = index;
    self.register = register;
    self.sessionError = sessionError;
    self.HomeIndex = HomeIndex;
    self.CategoryIndex = CategoryIndex;
    self.TaskIndex = TaskIndex;
    self.exit = exit;
    
    function checkSession(check){
        if(sessionName && sessionId && sessionName != "undefined" && sessionId != "undefined"){
            let path = window.location.pathname;
            if( path == '/' || path == '/register.html' || path == '/sessionerror.html'){
                window.location.assign("../WebView/HomeIndex.html");
            }
        }else if(check){
            window.location.assign("../sessionerror.html");
        }
    }
    
    function index(){
        window.location.assign("../index.html");
    }
    function register(){
        window.location.assign("../register.html");
    }
    function sessionError(){
        window.location.assign("../sessionerror.html");
    }
    function HomeIndex(){
        window.location.assign("../WebView/HomeIndex.html");
    }
    function CategoryIndex(){
        window.location.assign("../WebView/CategoryIndex.html");
    }
    function TaskIndex(){
        window.location.assign("../WebView/TaskIndex.html");
    }
    function exit(){
        sessionStorage.setItem('sessionName', "undefined");
        sessionStorage.setItem('sessionId', "undefined");
        window.location.assign("../index.html");
    }
}

function UserController($http) {
    let self = this;
    self.name = sessionName;
    self.id = sessionId;
    self.foto = sessionPhoto;
    self.cadUser = cadUser;
    self.loginUser = loginUser;
    
    function cadUser(name, email, senha, fbfoto) {
        if (senhaValida(senha)) {
            lockScreen();
            let foto = "../images/profile.png";
            if (fbfoto) {
                foto = fbfoto;
            }
            $http({
                  "method": "POST",
                  "async": true,
                  "crossDomain": true,
                  "url": "https://taskmanager-api.azurewebsites.net/api/User",
                  "headers": {
                    "content-type": "application/json"
                  },
                "processData": false,
                "data": {
                    "nome": name,
                    "email": email,
                    "senha": senha,
                    "foto": foto
                }
            }).then(function (response) {
                let user = response.data;
                let firstName = user.nome.split(" ");
                sessionStorage.setItem('sessionName', firstName[0]);
                sessionStorage.setItem('sessionId', user.id);
                sessionStorage.setItem('sessionPhoto', user.foto);
                window.location.assign('WebView/HomeIndex.html');
            }).catch(function (response) {
                unlockScreen();
                if(fbfoto){
                    unlockScreen();
                    showWaning("#loginstatus", 'Erro ao realizar Login via Facebook');
                }else if(response.status == "500"){
                    showWaning("#registerstatus", 'Erro na comunicação com o servidor');
                }else{
                    showWaning("#registerstatus", 'E-mail já cadastrado no sistema');
                }
            });
        }else{
            unlockScreen();
            showWaning("#registerstatus", 'Sua senha não obecede a regra');
        }
    }
    
    function senhaValida(senha){
        let ret = true;
        if(senha.length < 6 || senha.length > 32){
            ret = false;
        }
        return ret;
    }
    
    function loginUser(email, senha, fbInfo){
        if(email && senha){
            lockScreen();
            $http({
              "method": "GET",
              "async": true,
              "crossDomain": true,
              "url": `https://taskmanager-api.azurewebsites.net/api/User?email=${email}&senha=${senha}`,
              "headers": {
                "cache-control": "no-cache",
              }
            }).then(function (response) {
              let user = response.data;
              let firstName = user.nome.split(" ");
              sessionStorage.setItem('sessionName', firstName[0]);
              sessionStorage.setItem('sessionId', user.id);
              sessionStorage.setItem('sessionPhoto', user.foto);
              window.location.assign('WebView/HomeIndex.html');
            })
            .catch(function(response){
                if(fbInfo){
                    if(fbInfo.email){
                        cadUser(fbInfo.name, fbInfo.email, fbInfo.id, fbInfo.picture.data.url);
                    }else{
                        cadUser(fbInfo.name, fbInfo.id, fbInfo.id, fbInfo.picture.data.url);
                    }
                }else{
                    unlockScreen();
                    showWaning("#loginstatus", 'E-mail ou senha inválido');
                }
            });
        }
    }
}

function TaskController($http) {
    let self = this;
    self.status = stats;
    self.tarefas = [];
    $http.get(`https://taskmanager-api.azurewebsites.net/api/Task/${sessionId}`)
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
    
    function cadTask(tInput, cInput, tlist, uid) {
        let info = $('#button-info');
        let submit = $('#button-submit');
        if (tInput && tlist) {
            lockScreen();
            $http({
              "method": "POST",
              "async": true,
              "crossDomain": true,
              "url": "https://taskmanager-api.azurewebsites.net/api/task",
              "headers": {
                "content-type": "application/json",
              },
              "processData": false,
              "data": {
                    nome: tInput,
                    categoria: cInput,
                    feito: false,
                    userid: uid
                  }
            }).then(function (response) {
              unlockScreen();
              self.categorias.push({ nome: cat });
              submit.attr('class', 'd-none');
              $('.form-inline').css('border', 'none');
              info.attr('class', 'btn btn-success col-sm-12');
              info.html('<span class="fa fa-check-circle"> Tarefa cadastrada com sucesso</span>');
            })
            .catch(function(){
                unlockScreen();
            });
            
            tlist.push({
                nome: tInput,
                categoria: cInput,
                feito: false
            });
        }
    }
    
    function removeTask(tlist, key, id) {
        let info = $('#button-info');
        if (confirm(`Deseja mesmo excluir a tarefa "${tlist[key].nome}"`)) {
            lockScreen();
            $http({
              "method": "DELETE",
              "async": true,
              "crossDomain": true,
              "url": `https://taskmanager-api.azurewebsites.net/api/task/${id}`,
            }).then(function (response) {
            	unlockScreen();
                tlist.splice(key, 1);
                info.attr('class', 'btn btn-danger col-sm-12');
                info.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
            })
            .catch(function(){
                unlockScreen();
            });
        }
    }
    
    function flagTask(isdo, key, id){
        lockScreen();
        $http({
          "method": "PUT",
          "async": true,
          "crossDomain": true,
          "url": `https://taskmanager-api.azurewebsites.net/api/task/${id}`,
          "headers": {
            "content-type": "application/json",
          },
          "processData": false,
          "data": {feito:isdo}
        }).then(function (response) {
            unlockScreen();
            self.tarefas[key].feito = isdo;
        })
        .catch(function(){
            unlockScreen();
        });
    }
}

function CategoryController($http) {
    let self = this;
    self.categorias = [];
    $http.get(`https://taskmanager-api.azurewebsites.net/api/Category/${sessionId}`)
      .then(function(result) {
        result.data.forEach(c => {
            self.categorias.push(c);
        });
    });
    self.verify = verify;
    self.addCategoria = addCategoria;
    self.removeCategoria = removeCategoria;
    self.eraseInput = eraseInput;
    
    function addCategoria(cat, categorias, uid) {
        let but = $('#button-status');
        if (cat && categorias) {
            lockScreen();
            $http({
              "method": "POST",
              "async": true,
              "crossDomain": true,
              "url": "https://taskmanager-api.azurewebsites.net/api/category",
              "headers": {
                "content-type": "application/json",
              },
              "processData": false,
              "data": { 
                  nome : cat,
                  userid: uid
                  }
            }).then(function (response) {
              unlockScreen();
              self.categorias.push({ nome: cat });
              but.attr('class', 'btn btn-success col-sm-8 mb-2 mb-sm-0');
              but.html('<span class="fa fa-check-circle"> Categoria cadastrada com sucesso</span>');
              $('#button-submit').attr('class', 'd-none');
            })
            .catch(function(){
                unlockScreen();
            });
        }
    }

    function removeCategoria(list, key, id) {
        let but = $('#button-status');
        let status = $('#status-remove');
        if (confirm(`Deseja mesmo excluir a categoria "${list[key].nome}"`)) {
            lockScreen();
            $http({
              "method": "DELETE",
              "async": true,
              "crossDomain": true,
              "url": `https://taskmanager-api.azurewebsites.net/api/category/${id}`,
            }).then(function (response) {
                unlockScreen();
                list.splice(key, 1);
                but.html('<span class="fa fa-info-circle"> Cadastre aqui uma nova Categoria</span>');
                but.attr('class', 'btn btn-info col-sm-8 mb-2 mb-sm-0');
                status.attr('class', 'btn btn-danger col-sm-12');
                status.html('<span class="fa fa-check-circle"> Categoria excluida com sucesso</span>');
            })
            .catch(function(){
                unlockScreen();
            });
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

function lockScreen(){
    $("#overlay").css("display", "block");
}

function unlockScreen(){
    $("#overlay").css("display", "none");
}

function showWaning(elem, msg){
    $(elem).attr("class","btn btn-warning col-12");
    $(elem).text(msg);
    $(elem+">span").attr("class","fa fa-warning");
}

let token = "";

function checkLoginState() {
    FB.getLoginStatus(function(response) {
      token = response.authResponse.accessToken;
      statusChangeCallback(response);
    });
  }
  
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      fblogin();
    }
  }
  
  function fblogin() {
    FB.api('/me?fields=id,name,picture,email', function(response) {
        if(response.email){
            angular.element(document.getElementById('page-content-wrapper')).scope()
            .User.loginUser(response.email, response.id, response);
        }else{
            angular.element(document.getElementById('page-content-wrapper')).scope()
            .User.loginUser(response.id, response.id, response);
        }
      
    });
}