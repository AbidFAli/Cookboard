import React from 'react';

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.links = props.links;
    }
    render() {

        let content = this.links.map((current) => {
            return (<a href={current.link}> {current.name} </a>);
        });

        return (
            <div className="navBar">
                <nav> {content} </nav>
            </div>
        );
    }
}