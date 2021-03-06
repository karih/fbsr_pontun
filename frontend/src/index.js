import 'bootstrap/dist/css/bootstrap.min.css';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Entry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {quantity: 1};

		this.changeQuantity = this.changeQuantity.bind(this);
		this.addToCart = this.addToCart.bind(this);
	}

	changeQuantity(event) { 
		var value = parseInt(event.target.value);
		this.setState({quantity: value > 0 ? value : 0 }); 
	}
	addToCart(event) { 
		if (this.state.quantity > 0)
			this.props.addToCart(this.props.entry.id, this.state.quantity);
		event.preventDefault(); 
	}

	render() {
		if ('entry' in this.props) {
			let properties = "";
			let br = "";
			if (this.props.entry.properties.length > 0) {
				const _props = this.props.entry.properties.map((value, key) => <li className="list-inline-item small" key={value.adjusted}><span>{value.adjusted}: </span><span className="font-weight-bold">{value.value}</span></li>).reduce((acc, x) => acc === null ? [x] : [acc, '| ', x], null);
				properties = <ul className="list-inline">{_props}</ul>;
				br = <br />;
			}
			let desc = "";
			let br2 = "";
			if (this.props.entry.description.length > 0) {
				desc = <p className="description">{this.props.entry.description}</p>;
				br2 = <br />;
			}

			let price = <span>{this.props.entry.price.toLocaleString()} {this.props.entry.currency} &rarr; {Math.round(this.props.entry.price_isk).toLocaleString()} ISK</span>;
			if (this.props.entry.price === this.props.entry.price_isk) {
				price = <span>{Math.round(this.props.entry.price_isk).toLocaleString()} ISK</span>;
			}


			//const properties = "properties";
			return (
				<tr className="">
					<td key="id" className="column-sku">{this.props.entry.vendor_id}</td>
					<td key="name">
						<a target="_blank" rel="noopener noreferrer" href={this.props.entry.url}>{this.props.entry.item_name}</a>
						{br2}
						{desc}
						{br}
						{properties}
					</td>
					<td key="price" className="column-price">{price}</td>
					<td key="form" className="column-input">
						<input key="0" className="form-control form-control-sm" type="number" onChange={this.changeQuantity} defaultValue="1" min="0"/>
					</td>
					<td key="form-button" className="column-button">
							<button button="button" key="1" className="btn btn-secondary btn-sm" onClick={this.addToCart} >B??ta ?? k??rfu</button>
					</td>
				</tr>
			);
		} else {
			return "";
		}
	}
}

function CaretDown(props) {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-down-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			<path d="M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
		</svg>
	);
}

function CaretUp(props) {
	return (
		<svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-caret-up-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
			<path d="M7.247 4.86l-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
		</svg>
	);
}


class SearchResults extends React.Component {
	handleClickId    = () => { this.props.changeDirection('vendor_id'); }
	handleClickName  = () => { this.props.changeDirection('item_name'); }
	handleClickPrice = () => { this.props.changeDirection('price'); }

	render() {
		if (this.props.entries !== null) {
			return (
				<div className="">
					<table className="table table-striped table-sm">
						<thead>
							<tr>
								<th key="id"        onClick={this.handleClickId}   >V??run??mer {this.props.sortColumn === "vendor_id" ? (this.props.sortColumnDirection === "asc" ? <CaretUp /> : <CaretDown />) : ''}</th>
								<th key="name"      onClick={this.handleClickName} >Hlutur    {this.props.sortColumn === "item_name" ? (this.props.sortColumnDirection === "asc" ? <CaretUp /> : <CaretDown />) : ''}</th>
								<th key="price"     onClick={this.handleClickPrice}>Ver??      {this.props.sortColumn === "price"     ? (this.props.sortColumnDirection === "asc" ? <CaretUp /> : <CaretDown />) : ''}</th>
								<th key="update"                                   ></th>
								<th key="update2"                                  ></th>
							</tr>
						</thead>
						<tbody>
							{this.props.items.map((value, index) => {
								return <Entry key={value.vendor_id} entry={value} addToCart={this.props.addToCart} />
							})}
						</tbody>
					</table>
				</div>
			);
		} else { 
			return (<p key="nonzero-cart-warning" className="alert alert-warning">S??ki v??rulista.</p>);
		}
	}
}

class CartItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = {quantity: props.item.quantity, saved: true};

		this.changeQuantity = this.changeQuantity.bind(this);
		this.handleUpdate = this.handleUpdate.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleUpdate(event) {
		this.props.updateItem(this.props.item.id, this.state.quantity);
		event.preventDefault();
	}

	handleRemove(event) {
		this.props.removeItem(this.props.item.id);
		event.preventDefault();
	}

	changeQuantity(event) {
		var value = parseInt(event.target.value);
		this.setState({quantity: value > 0 ? value : 0, saved: false});
	}

	render() {
		const properties = this.props.item.properties.map((value, key) => <li className="list-inline-item small" key={value.adjusted}><span>{value.adjusted}: </span><span className="font-weight-bold">{value.value}</span></li>).reduce((acc, x) => acc === null ? [x] : [acc, '| ', x], null);
		let price = (this.props.item.price !== this.props.item.price_isk) ? (<span>{this.props.item.price.toLocaleString()} {this.props.item.currency} &rarr; {Math.round(this.props.item.price_isk).toLocaleString()} ISK</span>) : (<span>{Math.round(this.props.item.price_isk).toLocaleString()} ISK</span>);
		return (
			<tr className={this.state.saved ? '' : ' table-warning'}>
				<td key="id" className="column-sku">{this.props.item.vendor_id}</td>
				<td key="name">
					<a target="_blank" rel="noopener noreferrer" href={this.props.item.url}>{this.props.item.item_name}</a> <br />
					<ul className="list-inline">{properties}</ul>
				</td>
				<td key="price" className="column-price">{price}</td>
				<td key="quantity" className="column-input">
					<input type="number" className="form-control form-control-sm" value={this.state.quantity} onChange={this.changeQuantity} min="0" /> 
				</td>
				<td key="update" className="column-button2">
					<button key="update" button="button" disabled={this.state.saved} onClick={this.handleUpdate} className={"btn btn-sm mx-2 " + (this.state.saved ? 'btn-secondary' : 'btn-primary')}>Breyta</button>
					<button key="delete" button="button" onClick={this.handleRemove} className="btn btn-danger btn-sm">Ey??a</button>
				</td>
				<td key="total" className="priceisk">{Math.round(this.props.item.total_price_isk).toLocaleString()}</td>
			</tr>
		);
	}
}

class Cart extends React.Component {
	render() {
		if (this.props.cart.length > 0) {
			var items = this.props.cart
				.sort((a, b) => a.id > b.id ? 1 : -1)
				.map((item, i) => (<CartItem item={item} updateItem={this.props.updateItem} removeItem={this.props.removeItem} key={item.vendor_id+'-'+item.quantity} /> ) );
			var total_qty  = this.props.cart.map((item, i) => item.quantity).reduce((a, b) => a + b, 0);
			var total_cost = Math.round(this.props.cart.map((item, i) => item.total_price_isk).reduce((a, b) => a + b, 0));

			return (
				<div className="">
				<table className="table table-striped table-sm">
					<thead>
						<tr>
							<th key="id">V??run??mer</th>
							<th key="name">Hlutur</th>
							<th key="price">Ver??</th>
							<th key="quantity">Magn</th>
							<th key="update"></th>
							<th key="total">Samtals ISK</th>
						</tr>
					</thead>
					<tbody>
						{items}
					</tbody>
					<tfoot>
						<tr className="">
							<th key="samtals" colSpan="3">Samtals</th>
							<th key="qty">{total_qty}</th>
							<th key="blank"></th>
							<th key="total">{total_cost.toLocaleString()}</th>
						</tr>
					</tfoot>
				</table>
				</div>

			);
		} else {
			return (<p>Karfan er t??m</p>);
		}
	}
}

class Listing extends React.Component {
	constructor(props) {
		super(props);
		this.state = { 
			"listing": null, 
			"cart": null, 
			"name": "K??ri Hreinsson", 
			"showConfirmModal": false, 
			"showCancelModal": false, 
			"auth_token": "Bearer " + new URLSearchParams(window.location.search).get("token"),
			"auth_token_raw": new URLSearchParams(window.location.search).get("token"),
			"error": false,
			"sort_column": "item_name",
			"sort_direction": "asc",
			"search_query": "",
			"searchTimeout": 0
		};
		this.addToCart              = this.addToCart.bind(this);
		this.updateItem             = this.updateItem.bind(this);
		this.removeItem             = this.removeItem.bind(this);
		this.handleShowConfirmModal = this.handleShowConfirmModal.bind(this);
		this.handleShowCancelModal  = this.handleShowCancelModal.bind(this);
		this.handleConfirmGo        = this.handleConfirmGo.bind(this);
		this.handleConfirmAbort     = this.handleConfirmAbort.bind(this);
		this.handleCancelGo         = this.handleCancelGo.bind(this);
		this.handleCancelAbort      = this.handleCancelAbort.bind(this);
		this.handleSearch           = this.handleSearch.bind(this);
		this.changeDirection        = this.changeDirection.bind(this);
	}

	changeDirection(column) {
		console.log(column, this.state.sort_column);
		if (column === this.state.sort_column) {
			console.log("A");
			this.setState({"sort_direction": this.state.sort_direction === "asc" ? "desc" : "asc"}, () => this.search());
		} else {
			console.log("B");
			this.setState({"sort_direction": "asc", "sort_column": column}, ()=> this.search());
		}
	}

	addToCart(productId, quantity) {
		fetch("/api/cart", {method: 'POST', headers: {'Authorization': this.state.auth_token, 'Content-Type': 'application/json'}, 'body': JSON.stringify({"action": "add", "id": productId, "quantity": quantity})})
			.then(res => res.json())
			.then((result) => this.setState(result));
	}

	componentDidMount() {
		fetch("/api/listing/", {method: 'GET', headers: {'Authorization': this.state.auth_token}})
			.then(res => res.json())
			.then(
				(result) => {
					this.setState(result);
					this.search();
				},
				(result) => {
					this.setState({"error": true});
				}
			);
	}

	search(query) {
		fetch("/api/listing/items?q=" + this.state.search_query + "&c=" + this.state.sort_column + "&d=" + this.state.sort_direction, {method: 'GET', headers: {'Authorization': this.state.auth_token}})
			.then(res => res.json())
			.then(
				(result) => {this.setState(result)}
			);
	}

	handleSearch(event) {
		const self = this;
		
		// avoid searching on each letter typed
		if (self.state.searchTimeout) {
			clearTimeout(self.state.searchTimeout);
		}

		self.setState({
			"search_query": event.target.value,
			"searchTimeout": setTimeout(function() {
				self.search();
			}, 400)
		});

		event.preventDefault(); 
	}

	handleSubmit(event) {
		event.preventDefault();

	}

	updateItem(item_id, new_quantity) {
		fetch("/api/cart", {method: 'POST', headers: {'Authorization': this.state.auth_token, 'Content-Type': 'application/json'}, 'body': JSON.stringify({"action": "update", "id": item_id, "quantity": new_quantity})})
			.then(res => res.json())
			.then((result) => this.setState(result));
	}
	removeItem(item_id) {
		fetch("/api/cart", {method: 'POST', headers: {'Authorization': this.state.auth_token, 'Content-Type': 'application/json'}, 'body': JSON.stringify({"action": "delete", "id": item_id})})
			.then(res => res.json())
			.then((result) => this.setState(result));
	}
	clearCart() {
		fetch("/api/cart", {method: 'DELETE', headers: {'Authorization': this.state.auth_token, 'Content-Type': 'application/json'}})
			.then(res => res.json())
			.then((result) => this.setState(result));
	}
	handleShowConfirmModal(event) { this.setState({showConfirmModal: true}); event.preventDefault(); }
	handleConfirmAbort(event) { this.setState({showConfirmModal: false}); event.preventDefault(); }
	handleConfirmGo(event) {
		fetch("/api/cart/lock", {method: 'PUT', headers: {'Authorization': this.state.auth_token, 'Content-Type': 'application/json'}})
			.then(res => res.json())
			.then((result) => {
				console.log("RESPONSE", result);
				this.setState(result);
				this.setState({showConfirmModal: false});
				window.location.reload();
			});
		event.preventDefault(); 
	}

	handleShowCancelModal(event) { this.setState({showCancelModal: true}); event.preventDefault(); }
	handleCancelAbort(event) { this.setState({showCancelModal: false}); event.preventDefault(); }
	handleCancelGo(event) {
		event.preventDefault(); 
		window.location.href = "/b/cancel?token=" + this.state.auth_token_raw;
	}

	render() {
		if (this.state.error === true) {
			return <Message alert="warning" title="Vitlaus lykill">??essi lykill er ??virkur. Getur veri?? a?? p??ntunarfrestur s?? li??inn?</Message>;
		} else if (this.state.listing != null && this.state.listing.confirmed) {
			return <Message alert="success" title="P??ntun sta??fest">N?? hefur p??ntun veri?? sta??fest og f??tt anna?? a?? gera en a?? b????a eftir g??ssinu.</Message>;
		} else if (this.state.listing != null && this.state.listing.locked) {
			return <Message alert="success" title="P??ntun b????ur ??ess a?? ???? sta??festir hana">N?? b????ur ????n t??lvup??stur me?? yfirliti yfir p??ntun og hlekk til a?? kl??ra sta??festingu.</Message>;
		} else if (this.state.listing != null && this.state.items != null) {

			const warning_msg = this.state.cart.length > 0 ? (<p key="nonzero-cart-warning" className="alert alert-warning">Athugi?? a?? til a?? lj??ka p??ntun <strong>VER??UR</strong> a?? sta??festa p??ntun. </p>) : '';
			return (
				<div className="container-fluid">
					<div key="upper">
						<h1 className="my-3">FBSR P??ntunars????a : {this.state.listing.title}</h1>
						<h3>Notandi: {this.state.member.name} &lt;{this.state.member.email}&gt;</h3>
						<p>Athugi?? a?? ??etta er ????n pers??nuleg p??ntunars????a. Vinsamlegast ekki ??framsenda hlekkinn ?? a??ra - ???? geta vi??komandi breytt ??inni p??ntun.</p>
						<p>??egar ???? ert b??in(n) a?? fylla ??t p??ntun, smelltu ???? ?? sta??festa p??ntun h??r fyrir ne??an. Vi?? ??a?? munt ???? f?? t??lvup??st ??ar sem ???? ert be??in(n) um a?? fara yfir panta??a hluti og sta??festa p??ntun me?? a?? smella ?? vi??eigandi hlekk. Eftir a?? p??ntun hefur veri?? sta??fest h??r ?? s????unni ver??ur henni ekki breytt.</p>
						<p><strong>Athugi?? a?? ver?? h??r eru einungis ????tlu?? og geta breyst me?? gengi, flutningkostna??i e??a ????rum sl??kum ????ttum.</strong></p>
						<h2>Karfa 
							<button disabled={this.state.cart.length < 1} className="btn btn-primary btn-sm m-2" onClick={this.handleShowConfirmModal}>Hefja sta??festingarferli</button>
							<button type="button" className="btn btn-warning btn-sm m-2" onClick={this.handleShowCancelModal}>H??tta vi?? p??ntun</button>
						</h2>
						<Cart   cart={this.state.cart} updateItem={this.updateItem} removeItem={this.removeItem} />
						{warning_msg}
						<h2>V??rulisti</h2>
						<form className="form-inline" onSubmit={this.handleSubmit}>
							<div> 
								<div className="form-group">
									<label htmlFor="listing-search">Leita ?? v??rulista:</label>
									<input type="text" className="form-control my-2" id="listing-search" onChange={this.handleSearch} />
								</div>
							</div>
						</form>
						<SearchResults items={this.state.items} addToCart={this.addToCart} changeDirection={this.changeDirection} sortColumn={this.state.sort_column} sortColumnDirection={this.state.sort_direction} />
					</div>
					<BootstrapModal key="confirm-modal" show={this.state.showConfirmModal} cancel={this.handleConfirmAbort} confirm={this.handleConfirmGo} title="Sta??festa p??ntun?" no="H??tta vi??" yes="J?? - F?? t??lvup??st til sta??festingar">
						<p>Ertu viss um a?? ???? viljir sta??festa ??essa p??ntun? Ef ???? smellir ?? <em>J??</em> mun karfan l??sast og ???? f?? t??lvup??st me?? yfirliti yfir hva?? ???? hefur panta??. <strong>?? ??eim t??lvup??sti er hlekkur sem ??arf a?? smella ?? til a?? lj??ka sta??festingunni.</strong></p>
					</BootstrapModal>
					<BootstrapModal key="cancel-modal" show={this.state.showCancelModal} cancel={this.handleCancelAbort} confirm={this.handleCancelGo} title="H??tta vi?? p??ntun?" no="Nei - Halda ??fram a?? vinna ?? p??ntun" yes="J?? - ey??a p??ntuninni">
						<p>Ertu viss um a?? ???? viljir ey??a ??essari p??ntun? ???? tapar k??rfunni en ef ????r sn??st hugur ???? getur ???? fari?? aftur ?? skr??ningars????una til a?? byrja ferli?? upp ?? n??tt.</p>
					</BootstrapModal>
				</div>
			);
		} else {
			return (<h1>Loading</h1>);
		}
	}
}

function Message(props) {
	const className="alert alert-" + props.alert;
	return (
    <div className="container">
      <div className="row">
        <div className="col-sm-3"></div>
        <div className="col-sm-6">
					<h1>{props.title}</h1>
					<div className={className} role="alert">{props.children}</div>
        </div>
        <div className="col-sm-3"></div>
      </div>
    </div>
	);
}

class BootstrapModal extends React.Component {
	render() {
		if (this.props.show) {
			return (
				<div>
					<div key="0" className="modal-backdrop fade show" id="backdrop" style={{display: 'block'}}></div>
					<div key="1" className="modal show" style={{display: 'block'}} id="exampleModal" tabIndex="-1">
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">{this.props.title}</h5>
									<button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.cancel}>
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className="modal-body">
									{this.props.children}
								</div>
								<div className="modal-footer">
									<button type="button" onClick={this.props.cancel} className="btn btn-secondary" data-dismiss="modal">{this.props.no}</button>
									<button type="button" onClick={this.props.confirm} className="btn btn-primary">{this.props.yes}</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		} else {
			return "";
		}
	}
}


// ========================================

ReactDOM.render(
  <Listing />,
  document.getElementById('root')
);

