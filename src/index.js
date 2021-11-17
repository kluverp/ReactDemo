import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Image(props) {
    if (props.src && props.src.length) {
        return (
            <div>
                <img src={props.src} alt={props.alt} width="100%"/>
            </div>
        );
    }
    return null;
}

function SearchForm(props) {
    const [value, setValue] = useState('');
    const [src, setSrc] = useState('');

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        props.api.searchImg(value).then(res => {
            setSrc(res);
        });
    }

    return (
        <form onSubmit={(e) => handleSubmit(e)}>
            <label>
                <input type="text" className="input" value={value} onChange={(e) => handleChange(e)} style={{width: '70%'}} />
                <input type="submit" value="Zoeken" className="c-button c-button u-margin-left-2x"/>
            </label>
            <Image src={src} alt={value}/>
        </form>
    );
}

class DogAPI {
    static searchImg(query) {
        return fetch("https://dog.ceo/api/breed/" + query.toLowerCase() + "/images/random")
            .then(res => res.json())
            .then(result => {
                    return result.status === 'success' ? result.message : 'http://placehold.it/150/150';
                }
            );
    }
}

class CatAPI {
    static headers = new Headers({'x-api-key.': '129bf7b6-c59d-4d63-b617-3c084c2a083d'});

    static getHeaders() {
        return {headers: CatAPI.headers};
    }

    static searchBreed(query) {
        return fetch("https://api.thecatapi.com/v1/breeds/search?q=" + query, CatAPI.getHeaders())
            .then(res => res.json());
    }

    static searchImg(query) {
        return CatAPI.searchBreed(query)
            .then(res => {
                if (res && res[0]) {
                    return fetch("https://api.thecatapi.com/v1/images/search?breed_id=" + res[0].id, CatAPI.getHeaders())
                        .then(res => res.json())
                        .then(result => {
                            if (result && result[0]) {
                                return result[0].url;
                            }
                            return 'http://placehold.it/150/150';
                        });
                } else {
                    return 'http://placehold.it/150/150';
                }
            });

    }
}

class Page extends React.Component {
    render() {
        return (
            <div id="js-components" className="o-page o-page-container">
                <section className="o-container u-padding-top-8x u-margin-bottom-8x">
                    <h2 className="u-margin-bottom-2x u-margin-bottom-4x@size-m">Zoek afbeelding</h2>
                    <div className="o-grid">
                        <div
                            className="o-grid-row-1 o-grid-row-1@size-m o-grid-column-start-1-end-13 o-grid-column-start-1-end-7@size-m">
                            <h3 className="c-indepth-list__title u-margin-bottom font-size-4xl font-lh-2xl">
                                <span>Honden</span>
                            </h3>
                            <SearchForm api={DogAPI}/>
                        </div>
                        <div
                            className="o-grid-row-2 o-grid-row-1@size-m o-grid-column-start-1-end-13 o-grid-column-start-7-end-13@size-m">
                            <h3 className="c-indepth-list__title u-margin-bottom font-size-4xl font-lh-2xl">
                                <span>Katten</span>
                            </h3>
                            <SearchForm api={CatAPI}/>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}


// ========================================

ReactDOM.render(
    <Page/>,
    document.getElementById('root')
);
