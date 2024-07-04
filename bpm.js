this.workflowCockpit = workflowCockpit({
    init: _init,
    onSubmit: _saveData,
    onError: _rollback
});

function _init(data, info) {
    if (data && data.loadContext) {
        const { initialVariables } = data.loadContext;
        console.log("initialVariables: " + JSON.stringify(initialVariables));
    }
    
    info
        .getUserData()
        .then(function (user) {
            document.querySelector("#nomFun").setAttribute("value", user.fullname);
        })
        .then(function () {
        info.getPlatformData().then(function (platformData) {
            console.log(platformData);
        });
        info.getInfoFromProcessVariables().then(function(data) {
            const regex = /\{[^}]*\}/g;
            const parts = data[0].value.match(regex);


            console.log(data)
            console.log(parts)
        })
    });
}

function _saveData(data, info) {

    let newData = {};
    let selectArea = document.querySelector("#areaEmp");
    let selectRegArea = document.querySelector("#regArea");

    // Aba 1
    newData.nomFun = document.querySelector("#nomFun").value;
    newData.area = selectArea.options[selectArea.selectedIndex].value;
    newData.dataEntrada = document.querySelector("#dataEntrada").value;


    // Aba 2
    const dadosProprietarios = [];
    let blocksProp = document.querySelectorAll('#box-proprietario');

    blocksProp.forEach(function(block) {
        const nomeProp = block.querySelector('#nomeProp').value;
        const contatoProp = block.querySelector('#contatoProp').value;
        const emailProp = block.querySelector('#emailProp').value;
        
        dadosProprietarios.push({nomeProp, contatoProp, emailProp});
    })
    
    newData.props = dadosProprietarios;

    // Aba 3
    newData.regArea = selectRegArea.options[selectRegArea.selectedIndex].value;
    newData.cepArea = document.querySelector("#cepArea").value;
    newData.cepEstado = document.querySelector("#cepEstado").value;
    newData.municipio = document.querySelector("#municipio").value;
    newData.areaHect = document.querySelector("#areaHectare").value;
    newData.areaMQ = document.querySelector("#areaMQ").value;
 
    console.log(newData);
    return {
      formData: newData,
    };
}

function _rollback(data, info) {
    console.log(data.error);
    if (info.isRequestNew()) {
       return removeData(data.processInstanceId);
    }
    return rollbackData(data.processInstanceId);
}
