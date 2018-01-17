import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'reactstrap';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        console.log('testing for profile page render')
    }

    render() {
        return (
            <div>
                <Link to="/messages">
                    <Button color="secondary">X</Button>
                </Link>
            </div>
        )
    }
}