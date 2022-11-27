import React, {Component} from 'react';
import {AlignmentChart, AlignmentViewer} from '../src/index';

// import dataset1 from './data/sample.fasta';
// import dataset2 from './data/p53.fasta';
// import dataset3 from './data/p53_clustalo.fasta';
import dataset0 from './data/simple_sample.fasta';
// import dataset4 from '../data/p53_clustalo.clustal';
// import dataset4 from './data/1534023160.fasta';
import axios from "axios";


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
            value: [dataset0],
            type_algorithm: 'global',
            backtracking: false,
            type_string1: "ADN",
            type_string2: "ADN",
            len_string1: 7,
            len_string2: 7,
            score: 1,
            types_strings: [],
            center_string: ""

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
        this.onChangeFlagBacktracking = this.onChangeFlagBacktracking.bind(this);
    }

    setProps(newProps) {
        this.setState(newProps);
    }

    handleDataChange(event) {
        this.setState({type_algorithm: event.target.value});
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
                this.setState({types_strings: res.data.types_strings});
                this.setState({center_string: res.data.center_string});


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

    // ? Ejemplos de pruebas  ATAGACGACAT TTTAGCATGCGCAT

    onChangeFlagBacktracking() {
        this.setState({backtracking: !this.state.backtracking});
    }


    render() {
        console.log(dataset0);
        const {
            type_algorithm,
            events,
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
            score, types_strings, center_string
        } = this.state;
        return (
            <div
                style={{
                    fontFamily: ["helvetica", "sans-serif"],
                    padding: 16,
                    background: "#F5F5F5"
                }}
            >
                <h1>react-alignment-viewer Demo</h1>
                <div
                    style={{
                        padding: 16,
                        marginBottom: 32,
                        background: "#FFFFFF"
                    }}
                >
                    <p>
                        Selected dataset:
                    </p>
                    <select value={type_algorithm} onChange={this.handleDataChange}>
                        <option value="global">Algoritmo Global</option>
                        <option value="local">Algoritmo Local</option>
                        <option value="star">Algoritmo Star</option>
                    </select>
                    <input type="text" placeholder="Ingrese entrada 1" value={string1} onChange={this.updateValue1}/>
                    <input type="text" placeholder="Ingrese entrada 2" value={string2} onChange={this.updateValue2}/>
                    {type_algorithm === "star" && <button onClick={this.addInput}>
                        Añadir Input
                    </button>
                    }
                    {amountInputsExtra === 1 &&
                    <input type="text" placeholder="Ingrese entrada 3" value={string3} onChange={this.updateValue3}/>
                    }
                    {amountInputsExtra === 2 &&
                    <div>
                        <input type="text" placeholder="Ingrese entrada 3" value={string3}
                               onChange={this.updateValue3}/>
                        <input type="text" placeholder="Ingrese entrada 4" value={string4}
                               onChange={this.updateValue4}/>
                    </div>
                    }
                    {amountInputsExtra === 3 &&
                    <div>
                        <input type="text" placeholder="Ingrese entrada 3" value={string3}
                               onChange={this.updateValue3}/>
                        <input type="text" placeholder="Ingrese entrada 4" value={string4}
                               onChange={this.updateValue4}/>
                        <input type="text" placeholder="Ingrese entrada 5" value={string5}
                               onChange={this.updateValue5}/>
                    </div>}

                    {/* eslint-disable-next-line eqeqeq */}
                    {type_algorithm === "global" && <label>
                        <input type="checkbox" checked={backtracking} onChange={this.onChangeFlagBacktracking}/>
                        Backtracking
                    </label>

                    }

                    <button
                        onClick={this.onExecute}
                        // disabled={!searchText.length}
                    >
                        Ejecutar
                    </button>
                </div>
                <div style={{
                    padding: 16,
                    marginBottom: 32,
                    background: "#FFFFFF"
                }}>
                    {type_algorithm !== "star" &&
                    <div>
                        <h2>Información adicional</h2>
                        <p> Tipo de la cadena 1: {type_string1}</p>
                        <p> Tipo de la cadena 2: {type_string2}</p>
                        <p> Tamaño de la cadena 1: {len_string1}</p>
                        <p> Tamaño de la cadena 2: {len_string2}</p>
                        <p> Score: {score}</p>
                    </div>}

                    {type_algorithm === "star" &&
                    types_strings.map((item, index) => {
                        return <p> Tipo de la cadena {index}: {item} </p>

                    })
                    }
                    {type_algorithm === "star" && <p> Cadena Central: {center_string} </p>}
                </div>


                <div>
                    {/* eslint-disable-next-line no-unused-vars */}
                    {value.map((item, index) => {
                        return <AlignmentViewer
                            data={item}
                            extension='fasta'
                            onChange={this.handlePlotChange}
                        />
                    })}

                </div>


            </div>
        );
    }

}
