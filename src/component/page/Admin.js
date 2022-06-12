import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Globals from "../../util/Globals";

const axios = require('axios');

class Admin extends Component {
    constructor() {
        super();
        this.state = {
            reviewId: "",
            password: ""
        }
        this.deleteReview = this.deleteReview.bind(this);
        this.onChange = this.onChange.bind(this);

    }


    deleteReview() {

        if (!window.confirm("bu yorumu silmek istiyor musun"))
            return;

        const data = {
            reviewId:  this.state.reviewId,
            password: this.state.password
        }

        axios.post(Globals.serviceUrl + 'xat/deleteReview/',data )
            .then(function (response) {
                alert("yorum silindi");
            }).catch(function (res) {
            alert("yorumu sadece yazan kişi silebilir. aynı zamanda yeterince olumsuz oy alan yorumlar da silinir")
        });
    }

    onChange(e) {
        this.setState({[e.target.name]: e.target.value});
    }

    render() {
        let self = this;
        return (
            <div className="row app-container">
                <input
                    className="form-control"
                    type="text"
                    placeholder="id"
                    name="reviewId"
                    onChange={this.onChange}
                    value={this.state.reviewId}
                    onKeyDown={this.handleKeyDown}
                    aria-label="Search"/>
                <input
                    className="form-control"
                    type="password"
                    placeholder="***"
                    name="password"
                    onChange={this.onChange}
                    value={this.state.password}
                    aria-label="Search"/>
                <div className={"col-2 search-button"}>
                    <button onClick={this.deleteReview} className={"btn btn-success"}>ara</button>
                </div>
            </div>

        )
    };
}

export default Admin;
