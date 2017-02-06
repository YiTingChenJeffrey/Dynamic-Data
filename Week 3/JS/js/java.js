document.getElementById("hi").style.background = "yellow";
document.getElementById("no").style.fontSize = "800%";
document.getElementById("yes").style.textAlign = "center";




function textChange(){
    var haha = document.getElementById("hi");
    haha.innerHTML = "finaaa";
    
}

function colorchange(){
    var yolo = document.getElementById("no");
    yolo.style.backgroundColor = "green"; 
}

function add(){
    var number = 10;
    var number2 = 20;
    number1  =  number + number2;
    document.write(number1);
}

add();

function mOver(obj){
    obj.style.fontSize = "300%";
};

function mUp(obj){
    obj.style.textDecoration = "underline";
};