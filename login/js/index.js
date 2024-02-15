function Login() {
        var done=0; 
        var _0x29b1=["\x61\x62\x61\x73\x63\x61\x6C","\x64\x61\x76\x69\x64\x74\x6F\x72\x72\x65\x6A\x6F\x6E"];const password=_0x29b1[0];const user=_0x29b1[1]
        var user_input=document.login.user.value; 
        var password_input=document.login.password.value; 

        if(user == user_input && password == password_input){
            localStorage.setItem('user', {user, password});
            localStorage.setItem("isLogged",true);
            window.location = 'test/tabla.html'

        }else{
            window.alert('El usario ingresado o la contraseña son invalidos')
        }
}