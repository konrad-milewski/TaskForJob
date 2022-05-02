import "./App.css";
import MUIDataTable from "mui-datatables";
import {
  Button,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useState } from "react";
import { Convert } from "easy-currencies";

function App() {
  const [columns, setcolumns] = useState(["Kategoria", "Cena (zł)"]);
  const [data, setdata] = useState([
    ["Na Ziemi", 12],
    ["Na drzewie", 12],
    ["Miodożer", 12],
  ]);
  const [currency, setcurrency] = useState("PLN");
  const options = {
    filterType: "checkbox",
    jumpToPage: true,
    selectableRows: false,
    filter: false,
    download: false,
    print: false,
    viewColumns: false,
  };

  const [dataFromForm, setdataFromForm] = useState({
    category: "Na Ziemi",
    price: 0,
    animal_name: "",
  });

  const [categoryFromSelect, setcategoryFromSelect] = useState(1);
  const [error, seterror] = useState({});
  function addToList() {
    console.log(dataFromForm);
    seterror({});
    let error = {};

    if (dataFromForm.price < 1) {
      error.price = "Podaj poprawną cenę";
    }
    if (
      dataFromForm.animal_name.length < 3 &&
      dataFromForm.category === "custom"
    ) {
      error.animal_name = "Podaj poprawną nazwę zwierzaka";
    }
    console.log(Object.values(error).length);
    if (Object.keys(error).length === 0) {
      let item = [];
      if (dataFromForm.category === "custom") {
        item = [dataFromForm.animal_name, dataFromForm.price];
      } else {
        item = [dataFromForm.category, dataFromForm.price];
      }
      setdata((prev) => setdata([...prev, item]));
    } else {
      seterror(error);
    }
  }

  // async function printFiles () {
  //   const files = await getFilePaths()

  //   for await (const contents of files.map(file => fs.readFile(file, 'utf8'))) {
  //     console.log(contents)
  //   }
  // }

  async function changeCurr(curr) {
    let newArr = [];

    async function convert(value) {
      let res = await Convert(value[1]).from(currency).to(curr);
      return res;
    }

    for await (const arr of data.map((x) => convert(x))) {
      newArr.push([arr]);
    }

    newArr.forEach((x, idx) => {
      x[1] = x[0];
      x[0] = data[idx][0];
    });

    setdata(newArr);
    console.log(newArr);
    setcolumns((prev) => setcolumns([prev[0], `CENA (${curr})`]));
    setcurrency(curr);
  }

  return (
    <div className="App">
      <Container className="mt-5">
        <h5 className="mb-4">Lista Domków</h5>
        <MUIDataTable data={data} columns={columns} options={options} />

        <h5 className="mt-4">Dodaj Element Do Listy</h5>
        <Row className="mt-4">
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Kategoria
              </InputGroup.Text>
              <Form.Select
                onChange={(e) => {
                  setcategoryFromSelect(e.target.value);
                  setdataFromForm((prev) =>
                    setdataFromForm({ ...prev, category: e.target.value })
                  );
                }}
                aria-label="Default select example"
              >
                <option value="Na Ziemi">Na Ziemi</option>
                <option value="Na Drzewie">Na Drzewie</option>
                <option value="custom">Dla Zawierzaka</option>
              </Form.Select>
            </InputGroup>
          </Col>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Cena ({currency})
              </InputGroup.Text>
              <FormControl
                type="number"
                onChange={(e) => {
                  setdataFromForm((prev) =>
                    setdataFromForm({ ...prev, price: e.target.value })
                  );
                }}
                aria-label="Default"
                aria-describedby="inputGroup-sizing-default"
              />
            </InputGroup>
            {error && error?.price !== undefined && (
              <p className="text-danger">{error?.price}</p>
            )}
          </Col>
        </Row>

        <Row>
          {categoryFromSelect === "custom" && (
            <Col>
              <InputGroup className="mb-3">
                <InputGroup.Text id="inputGroup-sizing-default">
                  Nazwa Zwierzaka
                </InputGroup.Text>
                <FormControl
                  onChange={(e) => {
                    setdataFromForm((prev) =>
                      setdataFromForm({ ...prev, animal_name: e.target.value })
                    );
                  }}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              {error && error?.animal_name !== undefined && (
                <p className="text-danger">{error?.animal_name}</p>
              )}
            </Col>
          )}
        </Row>
        <Button
          onClick={() => {
            addToList();
          }}
        >
          Dodaj
        </Button>

        <h5 className="mt-4">Zmień walutę</h5>
        <Row className="mt-4">
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Text id="inputGroup-sizing-default">
                Waluta
              </InputGroup.Text>
              <Form.Select
                onChange={(e) => {
                  changeCurr(e.target.value);
                }}
                aria-label="Default select example"
              >
                <option value="PLN">Złotówki</option>
                <option value="EUR">Euro</option>
                <option value="USD">Dolary</option>
              </Form.Select>
            </InputGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
