import React from 'react';
import './App.css';
import jwt from 'jsonwebtoken';
import {Route, Switch, Redirect, BrowserRouter} from "react-router-dom";
import Login from "./components/Principal/Login";
import BarNav from "./components/Principal/BarNav";
import CustomerOptions from "./components/Cliente/CustomerOptions";
import CheckIn from "./components/Cliente/CheckIn";
import SignUp from "./components/Principal/SignUp";
import ChatGroup from "./components/Cliente/ChatGroup";
import ReservationManagement from "./components/Cliente/ReservationManagement";
import RestaurantMenu from "./components/Cliente/RestaurantMenu";


export class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            clienteLoggeado: false,
            nombreCliente: "",
            telefonoCliente: "",
            cedulaCliente: "",
            clienteCheckedIn: false,
            clienteMesa: '',

            trabajadorLoggeado: false,
            nombreTrabajador: "",

            adminLoggeado: false,
            nombreAdmin: ""
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleCheckin = this.handleCheckin.bind(this);
    }


    componentDidMount(){
        const token = localStorage.getItem('token-login')
        if(token){
            const user_type = jwt.verify(token, 'theGame').tipo_usuario
            switch (user_type){
                case 1: const checkin_token = localStorage.getItem('token-checkin')
                        const nombre_cliente = jwt.verify(token, 'theGame').nombre_cliente
                        const telefono_cliente = jwt.verify(token, 'theGame').telefono_cliente
                        const cedula_cliente = jwt.verify(token, 'theGame').cedula_cliente
                        if(checkin_token){
                            const checkin_value = jwt.verify(checkin_token, 'theCheckin').cliente_checked_in
                            const mesa = jwt.verify(checkin_token, 'theCheckin').cliente_mesa
                            this.setState({
                                clienteLoggeado: true,
                                nombreCliente:  nombre_cliente,
                                telefonoCliente: telefono_cliente,
                                cedulaCliente:  cedula_cliente,
                                clienteCheckedIn: checkin_value,
                                clienteMesa: mesa
                            }); break;
                        } else {

                            this.setState({
                                clienteLoggeado: true,
                                nombreCliente:  nombre_cliente,
                                telefonoCliente: telefono_cliente,
                                cedulaCliente:  cedula_cliente,
                            }); break;
                        }

                case 2: const nombre_trabajador = jwt.verify(token, 'theGame').nombre_trabajador
                        this.setState({
                            trabajadorLoggeado: true,
                            nombreTrabajador: nombre_trabajador
                        }); break;

                case 3: const nombre_admin = jwt.verify(token, 'theGame').nombre_admin
                        this.setState({
                            trabajadorLoggeado: true,
                            nombreTrabajador: nombre_admin
                        }); break;
                default: break;
            }
        }
    }

    handleLogin(tipoUsuario, fetched_user){
        if(tipoUsuario === 1){
            const token = {tipo_usuario: tipoUsuario,
                           cedula_cliente: fetched_user.cedula,
                           nombre_cliente: fetched_user.nombre,
                           telefono_cliente: fetched_user.telefono}
            localStorage.setItem('token-login', jwt.sign(token, 'theGame'))
            this.setState({
                clienteLoggeado: true,
                nombreCliente:  fetched_user.nombre,
                telefonoCliente: fetched_user.telefono,
                cedulaCliente: fetched_user.cedula
                })
        } else if(tipoUsuario === 2){
            const token = {tipo_usuario: tipoUsuario, nombre_trabajador: fetched_user.nombre}
            localStorage.setItem('token-login', jwt.sign(token, 'theGame'))
            this.setState({
                trabajadorLoggeado: true,
                nombreTrabajador: fetched_user.nombre
            })
        } else if(tipoUsuario === 3){
            const token = {tipo_usuario: tipoUsuario, nombre_admin: fetched_user.nombre}
            localStorage.setItem('token-login', jwt.sign(token, 'theGame'))
            this.setState({
                adminLoggeado: true,
                nombreTrabajador: fetched_user.nombre
            })
        }
    }

    handleLogout(){
        localStorage.removeItem('token-login')
        localStorage.removeItem('token-checkin')
        this.setState({
            clienteLoggeado: false,
            nombreCliente: "",
            telefonoCliente: "",

            trabajadorLoggeado: false,
            nombreTrabajador: "",

            adminLoggeado: false,
            nombreAdmin: "",
            clienteCheckedIn: false
        })
    }

    handleCheckin(value, mesa){
        const token = {cliente_checked_in: value,
                       cliente_mesa: mesa}
        localStorage.setItem('token-checkin', jwt.sign(token, 'theCheckin'))
        this.setState({
            clienteCheckedIn: value,
            clienteMesa: mesa
        })
    }

    render() {
        var is_logged = this.state.trabajadorLoggeado || this.state.clienteLoggeado;
        console.log(this.state.clienteCheckedIn)
        return (
            <div className="App">
                <BrowserRouter >
                    <Route render={() => <BarNav  isLogged = {is_logged}
                                                  handleLogout = {this.handleLogout}
                                                  clienteCheckedIn = {this.state.clienteCheckedIn}/>} />

                    {is_logged ? <Switch>
                            {this.state.clienteCheckedIn ? <Route exact path="/" render={() => <Redirect to="/chat"/>}/>
                                                                    : <Route exact path="/" render={() => <Redirect to="/mainmenu"/>}/> }
                            <Route exact path="/" render={() => <Redirect to="/mainmenu"/> } />
                            <Route path="/mainmenu" render={() => <CustomerOptions nombreCliente = {this.state.nombreCliente}
                                                                                   telefonoCliente = {this.state.telefonoCliente}
                            />}/>
                            <Route path="/checkin" render= {() => <CheckIn  nombreCliente = {this.state.nombreCliente}
                                                                            telefonoCliente = {this.state.telefonoCliente}
                                                                            cedulaCliente = {this.state.cedulaCliente}
                                                                            handleCheckin = {this.handleCheckin}/>} />
                            <Route path="/reservations" render= {() => <ReservationManagement nombreCliente = {this.state.nombreCliente}
                                                                                              telefonoCliente = {this.state.telefonoCliente}
                                                                                              cedulaCliente = {this.state.cedulaCliente} />} />
                            <Route path="/chat" render= {() => <ChatGroup nombreCliente = {this.state.nombreCliente}
                                                                          telefonoCliente = {this.state.telefonoCliente}
                                                                          cedulaCliente = {this.state.cedulaCliente}
                                                                          clienteMesa = {this.state.clienteMesa}
                                                                          clienteCheckedIn = {this.state.clienteCheckedIn}/>  } />
                            <Route path="/ordermenu" render= {() => <RestaurantMenu nombreCliente = {this.state.nombreCliente}
                                                                                    telefonoCliente = {this.state.telefonoCliente}
                                                                                    cedulaCliente = {this.state.cedulaCliente}
                                                                                    clienteMesa = {this.state.clienteMesa}/>  } />
                            <Route render={() => <Redirect to={{pathname: "/"}} />} />
                        </Switch>
                        : <Switch>
                            <Route exact path="/" render={() => <Redirect to="/login"/>}/>
                            <Route path="/login"  render={() => <Login handleLogin = {this.handleLogin} /> }/>
                            <Route path="/register" render={() => <SignUp handleLogin= {this.handleLogin} /> } />
                            <Route render={() => <Redirect to={{pathname: "/"}} />} />
                        </Switch>
                    }
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
