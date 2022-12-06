import {Component} from "react";
import React from 'react';
import {FornaContainer} from "../fornac";
import axios from "axios";
import "../fornac.css"

class VisualRNA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            len_string: 0,
            type: "",
            string: "",
            options: {
                'structure': '.((....))',
                'sequence': 'GGGAAAUCC'
            },
            container: new FornaContainer("#rna_ss",
                {'animation': true, 'zoomable': true, 'initialSize': [500, 300]})

        };
        this.updateString = this.updateString.bind(this)
        this.onExecute = this.onExecute.bind(this)

    }

    updateString = (event) => {
        const new_string = event.target.value;
        // eslint-disable-next-line no-invalid-this
        this.setState({string: new_string});
    }

    onExecute() {
        const baseURL = "http://127.0.0.1:8000/"
        const {
            string,
        } = this.state;

        const extend_url = "api/nussinov/";
        const data_to_send = {
            string: string,
        };

        // const {responseData}
        axios.post(baseURL + extend_url, data_to_send).then(
            res => {
                const sequence = res.data.sequence;
                const structure = res.data.structure;

                this.setState({len_string: res.data.len_string})
                this.setState({type: res.data.type})


                const options = {
                    'structure': structure,
                    'sequence': sequence
                }
                // const len_string = res.data.len_string;
                // const type = res.data.type;
                this.setState({options: options})
                const container = new FornaContainer("#rna_ss",
                    {'animation': true, 'zoomable': true, 'initialSize': [500, 300]});
                container.addRNA(this.state.options.structure, this.state.options);
                console.log("Termino el visual")

            }
        )

    };


// style={{'max-width': 800, margin: 'auto'}}"
    render() {

        const {string, len_string, type} = this.state

        return (
            <div style={{maxWidth: '800px', margin: 'auto'}}>
                 <h1>Visualizador del alogritmo Nussinov</h1>
                <div className="input-group mb-3">
                    <button className="btn btn-outline-secondary" type="button" id="button-addon1"
                            onClick={this.onExecute}>Ejecutar
                    </button>

                    <input type="text" className="form-control" placeholder="Ingrese una cadena RNA"
                           aria-label="Username"
                           aria-describedby="basic-addon1" onChange={this.updateString}/>
                </div>


                <table className="table">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Caracteristica</th>
                        <th scope="col">Valor</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>Tamaño:</td>
                        <td>{len_string}</td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Tipo:</td>
                        <td>{type}</td>
                    </tr>
                    </tbody>
                </table>

                <div id="rna_ss"></div>


            </div>
        );
    }


}

export default VisualRNA;
