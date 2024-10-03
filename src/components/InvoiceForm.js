import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import InvoiceItem from './InvoiceItem';
import InvoiceModal from './InvoiceModal';
import InputGroup from 'react-bootstrap/InputGroup';

class InvoiceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      currency: '$',
      currentDate: '',
      invoiceNumber: 1,
      dateOfIssue: '',
      billTo: '',
      billToEmail: '',
      billToAddress: '',
      billFrom: '',
      billFromEmail: '',
      billFromAddress: '',
      notes: '',
      total: '0.00',
      subTotal: '0.00',
      taxRate: '',
      taxAmount: '0.00',
      discountRate: '',
      discountAmount: '0.00'
    };
    this.state.items = [
      {
        id: 0,
        name: '',
        description: '',
        price: '1.00',
        quantity: 1
      }
    ];
    this.editField = this.editField.bind(this);
  }

  componentDidMount() {
    this.handleCalculateTotal();
  }

  handleRowDel(items) {
    const index = this.state.items.indexOf(items);
    this.state.items.splice(index, 1);
    this.setState(this.state.items);
    this.handleCalculateTotal();
  }

  handleAddEvent() {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      id: id,
      name: '',
      price: '1.00',
      description: '',
      quantity: 1
    };
    this.setState(
      (prevState) => ({
        items: [...prevState.items, newItem]
      }),
      this.handleCalculateTotal
    );
  }

  handleCalculateTotal() {
    const items = this.state.items;
    let subTotal = 0;

    items.forEach((item) => {
      subTotal += parseFloat(item.price) * parseInt(item.quantity);
    });

    subTotal = parseFloat(subTotal).toFixed(2);

    this.setState(
      {
        subTotal: subTotal
      },
      () => {
        const taxAmount = (subTotal * (this.state.taxRate / 100)).toFixed(2);
        const discountAmount = (subTotal * (this.state.discountRate / 100)).toFixed(2);
        const total = (subTotal - discountAmount + parseFloat(taxAmount)).toFixed(2);

        this.setState({
          taxAmount: taxAmount,
          discountAmount: discountAmount,
          total: total
        });
      }
    );
  }

  onItemizedItemEdit(evt) {
    const updatedItem = {
      id: evt.target.id,
      name: evt.target.name,
      value: evt.target.value
    };

    const updatedItems = this.state.items.map((item) => {
      if (item.id === updatedItem.id) {
        item[updatedItem.name] = updatedItem.value;
      }
      return item;
    });

    this.setState({ items: updatedItems }, this.handleCalculateTotal);
  }

  editField(event) {
    this.setState({ [event.target.name]: event.target.value }, this.handleCalculateTotal);
  }

  onCurrencyChange = (selectedOption) => {
    this.setState(selectedOption);
  };

  openModal = (event) => {
    event.preventDefault();
    this.handleCalculateTotal();
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <Form onSubmit={this.openModal}>
        <Row>
          <Col md={8} lg={9}>
            <Card className="p-4 p-xl-5 my-3 my-xl-4">
              <div className="d-flex flex-row align-items-start justify-content-between mb-3">
                <div className="d-flex flex-column">
                  <div className="mb-2">
                    <span className="fw-bold">Current Date: </span>
                    <span className="current-date">{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="d-flex flex-row align-items-center">
                    <span className="fw-bold d-block me-2">Due Date:</span>
                    <Form.Control
                      type="date"
                      value={this.state.dateOfIssue}
                      name="dateOfIssue"
                      onChange={this.editField}
                      style={{ maxWidth: '150px', borderRadius: '50px' }}
                      required
                    />
                  </div>
                </div>
                <div className="d-flex flex-row align-items-center">
                  <span className="fw-bold me-2">Invoice Number: </span>
                  <Form.Control
                    type="number"
                    value={this.state.invoiceNumber}
                    name="invoiceNumber"
                    onChange={this.editField}
                    min="1"
                    style={{ maxWidth: '70px', borderRadius: '50px' }}
                    required
                  />
                </div>
              </div>
              <hr className="my-4" />
              <Row className="mb-5">
                <Col>
                  <Form.Label className="fw-bold">Bill to:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice to?"
                    value={this.state.billTo}
                    name="billTo"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={this.state.billToEmail}
                    type="email"
                    name="billToEmail"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={this.state.billToAddress}
                    name="billToAddress"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                </Col>
                <Col>
                  <Form.Label className="fw-bold">Bill from:</Form.Label>
                  <Form.Control
                    placeholder="Who is this invoice from?"
                    value={this.state.billFrom}
                    name="billFrom"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                  <Form.Control
                    placeholder="Email address"
                    value={this.state.billFromEmail}
                    type="email"
                    name="billFromEmail"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                  <Form.Control
                    placeholder="Billing address"
                    value={this.state.billFromAddress}
                    name="billFromAddress"
                    className="my-2"
                    style={{ borderRadius: '50px' }}
                    onChange={this.editField}
                    required
                  />
                </Col>
              </Row>
              <InvoiceItem
                onItemizedItemEdit={this.onItemizedItemEdit.bind(this)}
                onRowAdd={this.handleAddEvent.bind(this)}
                onRowDel={this.handleRowDel.bind(this)}
                currency={this.state.currency}
                items={this.state.items}
              />
              <Row className="mt-4 justify-content-end">
                <Col lg={6}>
                  <div className="d-flex flex-row align-items-start justify-content-between">
                    <span className="fw-bold">Subtotal:</span>
                    <span>{this.state.currency}{this.state.subTotal}</span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Discount:</span>
                    <span>
                      <span className="small">({this.state.discountRate || 0}%)</span>
                      {this.state.currency}{this.state.discountAmount || 0}
                    </span>
                  </div>
                  <div className="d-flex flex-row align-items-start justify-content-between mt-2">
                    <span className="fw-bold">Tax:</span>
                    <span>
                      <span className="small">({this.state.taxRate || 0}%)</span>
                      {this.state.currency}{this.state.taxAmount || 0}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex flex-row align-items-start justify-content-between" style={{ fontSize: '1.125rem' }}>
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold">{this.state.currency}{this.state.total || 0}</span>
                  </div>
                </Col>
              </Row>
              <hr className="my-4" />
              <Form.Label className="fw-bold">Notes:</Form.Label>
              <Form.Control
                placeholder="Thanks for your business!"
                name="notes"
                value={this.state.notes}
                onChange={this.editField}
                as="textarea"
                className="my-2"
                rows={1}
                style={{ borderRadius: '50px' }}
              />
            </Card>
          </Col>
          <Col md={4} lg={3}>
            <div className="sticky-top pt-md-3 pt-xl-4">
              <Button variant="primary" type="submit" className="d-block w-100" style={{ borderRadius: '50px' }}>
                Review Invoice
              </Button>
              <InvoiceModal
                showModal={this.state.isOpen}
                closeModal={this.closeModal}
                info={this.state}
                items={this.state.items}
                currency={this.state.currency}
                subTotal={this.state.subTotal}
                taxAmount={this.state.taxAmount}
                discountAmount={this.state.discountAmount}
                total={this.state.total}
              />
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Currency:</Form.Label>
                <Form.Select
                  onChange={(event) => this.onCurrencyChange({ currency: event.target.value })}
                  className="btn btn-light my-1"
                  aria-label="Change Currency"
                  style={{ borderRadius: '50px' }}
                >
                  <option value="$">USD (United States Dollar)</option>
                  <option value="£">GBP (British Pound Sterling)</option>
                  <option value="¥">JPY (Japanese Yen)</option>
                  <option value="$">CAD (Canadian Dollar)</option>
                  <option value="$">AUD (Australian Dollar)</option>
                  <option value="$">SGD (Singapore Dollar)</option>
                  <option value="₹">INR (Indian Rupee)</option>
                  <option value="₿">BTC (Bitcoin)</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Tax rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="taxRate"
                    type="number"
                    value={this.state.taxRate}
                    onChange={this.editField}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                    style={{ borderRadius: '50px' }}
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small" style={{ borderRadius: '50px' }}>
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
              <Form.Group className="my-3">
                <Form.Label className="fw-bold">Discount rate:</Form.Label>
                <InputGroup className="my-1 flex-nowrap">
                  <Form.Control
                    name="discountRate"
                    type="number"
                    value={this.state.discountRate}
                    onChange={this.editField}
                    className="bg-white border"
                    placeholder="0.0"
                    min="0.00"
                    step="0.01"
                    max="100.00"
                    style={{ borderRadius: '50px' }}
                  />
                  <InputGroup.Text className="bg-light fw-bold text-secondary small" style={{ borderRadius: '50px' }}>
                    %
                  </InputGroup.Text>
                </InputGroup>
              </Form.Group>
            </div>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default InvoiceForm;
