import React, {Component} from 'react';
import {AlignmentViewer} from '../src/index';

// import dataset1 from './data/sample.fasta';
// import dataset2 from './data/p53.fasta';
// import dataset3 from './data/p53_clustalo.fasta';
import dataset0 from './data/simple_sample.fasta';
// import dataset4 from '../data/p53_clustalo.clustal';
// import dataset4 from './data/1534023160.fasta';
import axios from "axios";

import {Link, BrowserRouter, Route} from 'react-router-dom'
import VisualRNA from "../src/ownComponents/VisualRNA";

// const DATA = {
//     dataset0,
//     dataset1,
//     dataset2,
//     dataset3,
//     dataset4
// };
// ?Explicación de la esquema de colores como estandares
// https://www.jalview.org/help/html/colourSchemes/
// ?Github del esquema implementado
// https://github.com/plotly/react-msa-viewer
export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // value: dataset1,
            events: [],
            string1: '',
            string2: '',
            string3: '',
            string4: '',
            string5: '',
            amountInputsExtra: 0,
            value: [],
            type_algorithm: 'global',
            backtracking: false,
            type_string1: "ADN",
            type_string2: "ADN",
            len_string1: 7,
            len_string2: 7,
            score: 1,
            types_strings: [],
            center_string: "",
            activate_link_1: "active",
            activate_link_2: ""

        };
        this.setProps = this.setProps.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handlePlotChange = this.handlePlotChange.bind(this);
        this.updateValue1 = this.updateValue1.bind(this);
        this.updateValue2 = this.updateValue2.bind(this);
        this.updateValue3 = this.updateValue3.bind(this);
        this.updateValue4 = this.updateValue4.bind(this);
        this.updateValue5 = this.updateValue5.bind(this);
        this.onExecute = this.onExecute.bind(this);
        this.addInput = this.addInput.bind(this);
        this.updateHeader2 = this.updateHeader2.bind(this);
        this.updateHeader1 = this.updateHeader1.bind(this);
        this.onChangeFlagBacktracking = this.onChangeFlagBacktracking.bind(this);
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    handleDataChange(event) {
        this.setState({type_algorithm: event.target.value});
        this.setState({amountInputsExtra: 0});
    }

    handlePlotChange(event) {
        const events = this.state.events;
        events.unshift(JSON.stringify(event));
        this.setState({events: events});
    }

    // *Nuevas funciones escritas
    // eslint-disable-next-line no-unused-vars
    onExecute() {
        const baseURL = "http://127.0.0.1:8000/"
        let extend_url = "";
        let data_to_send = {
            string1: this.state.string1,
            string2: this.state.string2,
        };
        const {
            string1,
            string2,
            string3,
            string4,
            string5,
            type_algorithm
        } = this.state;
        const array_strings = []
        array_strings.push(string1)
        array_strings.push(string2)
        array_strings.push(string3)
        array_strings.push(string4)
        array_strings.push(string5)
        const array_strings_filter = array_strings.filter(s => s !== "");
        console.log("Arreglo de strings para estrella:\n", array_strings_filter)

        switch (this.state.type_algorithm) {
            case 'global':
                extend_url = "api/global/";
                data_to_send.backtracking = this.state.backtracking
                break;
            case 'local':
                extend_url = "api/local/";

                break;
            case 'star':
                extend_url = "api/star/";
                // eslint-disable-next-line no-const-assign
                data_to_send = {strings: array_strings_filter};
                break;
            default:
                break;
        }
        // ?Si funciona el formato si lo unimos con el salto de linea
        // const try_var = [">S1\nACCCT\n>S2\nAGT-",">S3\nAG-T\nS4\nAGT-"];
        // console.log(try_var);
        // this.setState({valueFasta: try_var});
        // const data_to_send = {
        //     string1: this.state.string1,
        //     string2: this.state.string2,
        //     backtracking: this.state.backtracking
        // };
        // console.log(data_to_send)
        const result_in_format_fast = [];
        // const {responseData}
        axios.post(baseURL + extend_url, data_to_send).then(
            res => {
                const alignments = res.data.alignments;
                this.setState({type_string1: res.data.type_string1});
                this.setState({type_string2: res.data.type_string2});
                this.setState({len_string1: res.data.len_string1});
                this.setState({type_string1: res.data.type_string1});
                this.setState({score: res.data.score});


                console.log("Tipos de String:\n", res.data.types_strings)

                if (type_algorithm === "global") {
                    let index = 0

                    for (const alig of alignments) {
                        let pair_aligment = ""
                        // let pair_aligment = []
                        for (const a of alig) {
                            pair_aligment += ">S" + index.toString() + "\n";
                            pair_aligment += a + "\n";
                            index += 1;
                        }
                        result_in_format_fast.push(pair_aligment)
                    }
                    // eslint-disable-next-line eqeqeq
                } else if (type_algorithm === "local") {
                    let index = 0
                    let subsequence = ""
                    for (const alig of alignments) {

                        subsequence += ">S" + index.toString() + "\n";
                        subsequence += alig + "\n";
                        index += 1
                    }
                    result_in_format_fast.push(subsequence)

                } else if (type_algorithm === "star") {
                    // console.log(res.data)
                    this.setState({types_strings: res.data.types_strings});
                    this.setState({center_string: res.data.center_string});

                    console.log("Alineamiento del algoritmo estrella:\n", alignments)

                    let index = 0
                    let subsequence = ""
                    for (const alig of alignments) {

                        subsequence += ">S" + index.toString() + "\n";
                        subsequence += alig + "\n";
                        index += 1
                    }
                    result_in_format_fast.push(subsequence)
                }
                this.setState({value: result_in_format_fast});
                // console.log(result_in_format_fast);
                // this.setState({value: result_in_format_fast});
            }
        )

    };


    updateValue1(event) {
        this.setState({string1: event.target.value});
    }

    updateValue2(event) {
        this.setState({string2: event.target.value});
    }

    updateValue3(event) {
        this.setState({string3: event.target.value});
    }

    updateValue4(event) {
        this.setState({string4: event.target.value});
    }

    updateValue5(event) {
        this.setState({string5: event.target.value});
    }

    addInput() {
        const amount = this.state.amountInputsExtra;
        if (amount !== 3) {
            this.setState({amountInputsExtra: amount + 1});
        }
    }

    updateHeader2() {
        this.setState({activate_link_2: "active"})
        this.setState({activate_link_1: ""})
    }

    updateHeader1() {
        this.setState({activate_link_2: ""})
        this.setState({activate_link_1: "active"})
    }

    // ? Ejemplos de pruebas  ATAGACGACAT TTTAGCATGCGCAT

    onChangeFlagBacktracking() {
        this.setState({backtracking: !this.state.backtracking});
    }


    render() {
        console.log(dataset0);
        const {
            type_algorithm,
            string1,
            string2,
            string3,
            string4,
            string5,
            value,
            backtracking,
            amountInputsExtra,
            type_string1,
            type_string2,
            len_string1,
            len_string2,
            score, types_strings, center_string, activate_link_1, activate_link_2
        } = this.state;
        return (
            <BrowserRouter>
                <div className="container">
                    <header className="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
                        <a href="/"
                           className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 className="bi bi-bootstrap" viewBox="0 0 16 16">
                                <path
                                    d="M5.062 12h3.475c1.804 0 2.888-.908 2.888-2.396 0-1.102-.761-1.916-1.904-2.034v-.1c.832-.14 1.482-.93 1.482-1.816 0-1.3-.955-2.11-2.542-2.11H5.062V12zm1.313-4.875V4.658h1.78c.973 0 1.542.457 1.542 1.237 0 .802-.604 1.23-1.764 1.23H6.375zm0 3.762V8.162h1.822c1.236 0 1.887.463 1.887 1.348 0 .896-.627 1.377-1.811 1.377H6.375z"/>
                                <path
                                    d="M0 4a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V4zm4-3a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H4z"/>
                            </svg>
                            <span className="fs-4" style={{marginLeft: '10px'}}>2022 Luis Salazar</span>
                        </a>

                        <ul className="nav nav-pills">
                            <li className="nav-item" onClick={this.updateHeader1}>
                                <Link to='/' className={"nav-link " + activate_link_1}>
                                    Alineamientos Generales
                                </Link>
                            </li>

                            <li className="nav-item" onClick={this.updateHeader2}><Link to='/EstructuraSecuencial'
                                                                                        className={"nav-link " + activate_link_2}>
                                Estructura secuencial
                            </Link></li>
                        </ul>
                    </header>
                </div>


                <Route path="/" exact>
                    <div style={{maxWidth: '800px', margin: 'auto'}}>
                        <h1>Visualizador de algoritmos de alineamientos generales</h1>

                        <div className="form-group">
                            <p>
                                Seleccione un algoritmo:
                            </p>
                            <div className="input-group mb-3">
                                <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                                <select onChange={this.handleDataChange} className="form-select" id="inputGroupSelect01"
                                        value={type_algorithm}>
                                    <option value="global">Algoritmo Global</option>
                                    <option value="local">Algoritmo Local</option>
                                    <option value="star">Algoritmo Star</option>
                                </select>
                            </div>

                            {type_algorithm === "star" &&

                            <button type="button" className="btn btn-primary" onClick={this.addInput}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                     className="bi bi-plus-circle" viewBox="0 0 16 16">
                                    <path
                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"></path>
                                    <path
                                        d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
                                </svg>
                                Añadir Input
                            </button>

                            }

                            <div className="mb-3 row">
                                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 1:</label>
                                <div className="col-sm-10">
                                    <input type="text" placeholder="Ingrese entrada 1" value={string1}
                                           className="form-control"
                                           onChange={this.updateValue1}/>

                                </div>
                            </div>
                            <div className="mb-3 row">
                                <label htmlFor="inputPassword" className="col-sm-2 col-form-label">Cadena 2:</label>
                                <div className="col-sm-10">
                                    <input type="text" placeholder="Ingrese entrada 2" value={string2}
                                           onChange={this.updateValue2} className="form-control"/>
                                </div>
                            </div>


                            {amountInputsExtra === 1 &&
                            <div className="mb-3 row">
                                <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 3:</label>
                                <div className="col-sm-10">
                                    <input type="text" placeholder="Ingrese entrada 3" value={string3}
                                           onChange={this.updateValue3} className="form-control"/>
                                </div>
                            </div>
                            }

                            {amountInputsExtra === 2 &&
                            <div>
                                <div className="mb-3 row">
                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 3:</label>
                                    <div className="col-sm-10">
                                        <input type="text" placeholder="Ingrese entrada 3" value={string3}
                                               onChange={this.updateValue3} className="form-control"/>
                                    </div>
                                </div>
                                <div className="mb-3 row">
                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 4:</label>
                                    <div className="col-sm-10">
                                        <input type="text" placeholder="Ingrese entrada 4" value={string4}
                                               onChange={this.updateValue4} className="form-control"/>
                                    </div>
                                </div>

                            </div>
                            }


                            {amountInputsExtra === 3 &&
                            <div>
                                <div className="mb-3 row">
                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 3:</label>
                                    <div className="col-sm-10">
                                        <input type="text" placeholder="Ingrese entrada 3" value={string3}
                                               onChange={this.updateValue3} className="form-control"/>
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 4:</label>
                                    <div className="col-sm-10">
                                        <input type="text" placeholder="Ingrese entrada 4" value={string4}
                                               onChange={this.updateValue4} className="form-control"/>
                                    </div>
                                </div>

                                <div className="mb-3 row">
                                    <label htmlFor="staticEmail" className="col-sm-2 col-form-label">Cadena 5:</label>
                                    <div className="col-sm-10">
                                        <input type="text" placeholder="Ingrese entrada 5" value={string5}
                                               onChange={this.updateValue5} className="form-control"/>
                                    </div>
                                </div>

                            </div>

                            }


                            {type_algorithm === "global" &&
                            <div className="form-check">
                                <input onChange={this.onChangeFlagBacktracking} checked={backtracking}
                                       className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    Backtracking
                                </label>
                            </div>

                            }

                            <button onClick={this.onExecute} type="button" className="btn btn-success">Ejecutar</button>


                        </div>

                        {value.length > 0 && <table className="table">
                            <thead>
                            <tr>
                                <th scope="col">Información adicional</th>
                            </tr>
                            </thead>


                            {type_algorithm !== "star" &&
                            <tbody>
                            <tr>
                                <th>Tipo de la cadena 1:</th>
                                <th>{type_string1} </th>
                            </tr>
                            <tr>
                                <th>Tipo de la cadena 2:</th>
                                <th>{type_string2} </th>
                            </tr>

                            <tr>
                                <th>Tamaño de la cadena 1:</th>
                                <th>{len_string1} </th>
                            </tr>


                            <tr>
                                <th>Tamaño de la cadena 2:</th>
                                <th>{len_string2} </th>
                            </tr>


                            <tr>
                                <th>Score:</th>
                                <th>{score} </th>
                            </tr>
                            </tbody>}

                            <tbody>

                            {type_algorithm === "star" && types_strings.length > 0 &&
                            types_strings.map((item, index) => {
                                return <tr>
                                    <th>Tipo de la cadena {index}:</th>
                                    <th>{item} </th>
                                </tr>
                                // return <p> Tipo de la cadena {index}: {item} </p>

                            })
                            }
                            < /tbody>
                            {type_algorithm === "star" &&
                            <tr>
                                <th>Cadena Central:</th>
                                <th>{center_string} </th>
                            </tr>
                            }

                        </table>
                        }

                    </div>
                    <div>
                        {/* eslint-disable-next-line no-unused-vars */}
                        {value.map((item, index) => {

                            return (
                                <div style={{textAlign: 'center'}}>
                                    <p> {index + 1}° alineación: </p>
                                    <AlignmentViewer
                                        data={item}
                                        extension='fasta'
                                        onChange={this.handlePlotChange}
                                    />
                                </div>
                            )
                        })}

                    </div>

                </Route>
                <Route path='/EstructuraSecuencial'>
                    <VisualRNA/>
                </Route>

            </BrowserRouter>
        );
    }

}
