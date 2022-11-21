import React, {Component} from 'react';
import {AlignmentChart, AlignmentViewer} from '../src/index';

import dataset1 from './data/sample.fasta';
import dataset2 from './data/p53.fasta';
import dataset3 from './data/p53_clustalo.fasta';
import dataset0 from './data/simple_sample.fasta';
// import dataset4 from '../data/p53_clustalo.clustal';
import dataset4 from './data/1534023160.fasta';
import axios from "axios";


const DATA = {
    dataset0,
    dataset1,
    dataset2,
    dataset3,
    dataset4
};


export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // value: dataset1,
            events: [],
            string1: '',
            string2: '',
            value: dataset0,
            type_algorithm: 'global'
        };
        this.setProps = this.setProps.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.handlePlotChange = this.handlePlotChange.bind(this);
        this.updateValue1 = this.updateValue1.bind(this);
        this.updateValue2 = this.updateValue2.bind(this);
        this.onExecute = this.onExecute.bind(this);
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

        switch (this.state.type_algorithm) {
            case 'global':
                extend_url = "api/global/";
                break;
            case 'local':
                extend_url = "api/local/";
                break;
            default:
                break;
        }
        // ?Si funciona el formato si lo unimos con el salto de linea
        // const try_var = ">S1\nACCCT\n>S2\nAGT-\n>S3\nAG-T";
        // console.log(try_var);
        // this.setState({valueFasta: try_var});
        const data_to_send = {
            string1: this.state.string1,
            string2: this.state.string2,
            backtracking: true
        };
        let result_in_format_fast = "";
        // const {responseData}
        axios.post(baseURL + extend_url, data_to_send).then(
            res => {
                const alignments = res.data.alignments;
                if (this.state.type_algorithm === "global") {
                    let index = 0
                    for (const alig of alignments) {
                        for (const a of alig) {
                            result_in_format_fast += ">S" + index.toString() + "\n";
                            result_in_format_fast += a + "\n";
                            index += 1
                        }
                    }
                    // eslint-disable-next-line eqeqeq
                } else if (this.state.type_algorithm == "local") {
                    let index = 0
                    for (const alig of alignments) {

                        result_in_format_fast += ">S" + index.toString() + "\n";
                        result_in_format_fast += alig + "\n";
                        index += 1

                    }
                }

                console.log(result_in_format_fast);
                this.setState({value: result_in_format_fast});
            }
        )

    };


    updateValue1(event) {
        this.setState({string1: event.target.value});
    }

    updateValue2(event) {
        this.setState({string2: event.target.value});
    }
    // ? Ejemplos de pruebas  ATAGACGACAT TTTAGCATGCGCAT
    render() {
        const {type_algorithm, events, string1, string2, value} = this.state;

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
                    </select>
                    <input type="text" placeholder="Ingrese entrada 1" value={string1} onChange={this.updateValue1}/>
                    <input type="text" placeholder="Ingrese entrada 2" value={string2} onChange={this.updateValue2}/>
                    <button
                        onClick={this.onExecute}
                        // disabled={!searchText.length}
                    >
                        Ejecutar
                    </button>
                </div>
                <div>
                    <AlignmentViewer
                        // data={DATA[value]}
                        data={value}
                        extension='fasta'
                        onChange={this.handlePlotChange}
                    />
                </div>
                <div
                    style={{
                        padding: 16,
                        marginTop: 16,
                        background: "#FFFFFF"
                    }}
                >
                    <p>
                        Events:
                    </p>
                    <textarea
                        style={{
                            width: '100%',
                            height: 200,
                            fontSize: '14px'
                        }}
                        value={events.join('\n')}
                        readOnly
                    >
                    </textarea>
                </div>
            </div>
        );
    }
}
