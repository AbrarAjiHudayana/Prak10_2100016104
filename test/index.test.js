const {
  fetchProductsData,
  setProductsCards,
  convertToRupiah,
  countDiscount,
} = require("../src/index.js");
const dataCart = require("../src/data/cart.js");
const { fetchCartsData } = require("../src/dataService.js");
const axios = require("axios");

describe('Pengujian API Produk', () => {
  test('harus mengembalikan data produk dengan id 1', async () => {
    const idProduk = 1;
    const dataProduk = await fetchProductsData(idProduk)
    expect(dataProduk).toBeDefined();
    expect(dataProduk.id).toBe(idProduk);
  });

  test('harus memeriksa panjang products dengan batas tertentu', async () => {
    const batas = 35;
    const dataProduk = await fetchProductsData();
    expect(dataProduk).toBeDefined();
    expect(dataProduk.products.length).toBeLessThanOrEqual(batas);
  });

  test('harus mengembalikan data produk dengan judul tertentu', async () => {
    const judulTertentu = 'Eau De Perfume Spray';
    const dataProduk = await fetchProductsData();
    expect(dataProduk).toBeDefined();
    const produkDenganJudul = dataProduk.products.find(p => p.title === judulTertentu);
    expect(produkDenganJudul).toBeDefined();
    expect(produkDenganJudul.title).toBe(judulTertentu);
  });
});

describe('Pengujian API Keranjang', () => {
  beforeEach(() => {
    jest.spyOn(axios, 'get').mockResolvedValue({ data: dataCart });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Data keranjang berhasil diambil!', async () => {
    const hasil = await axios.get('https://dummyjson.com/carts');
    expect(hasil.data).toEqual(dataCart);
  });

  it('membandingkan panjang semua keranjang dengan total', async () => {
    const hasil = await axios.get('https://dummyjson.com/carts');
    expect(hasil.data.carts.length).toBe(dataCart.total);
  });
});

describe('Pengujian Utilitas Produk', () => {
  let produk;

  beforeAll(async () => {
    const dataProduk = await fetchProductsData();
    produk = dataProduk.products;
  });

  test('convertToRupiah harus mengonversi harga dengan benar', () => {
    const harga = 2000;
    const hargaTerkonversi = convertToRupiah(harga);
    expect(hargaTerkonversi).toMatch(/Rp\s*30\.872\.000,00/);
  });

  test('convertToRupiah harus menangani nilai harga yang berbeda', () => {
    const harga = 10000;
    const hargaTerkonversi = convertToRupiah(harga);
    expect(hargaTerkonversi).toMatch(/Rp\s*154\.360\.000,00/);
  });

  test('countDiscount harus menghitung harga diskon dengan benar', () => {
    const harga = 2000;
    const persentaseDiskon = 25;
    const hargaSetelahDiskon = countDiscount(harga, persentaseDiskon);
    expect(hargaSetelahDiskon).toBe(1500);
  });

  test('countDiscount harus menghitung harga diskon dengan benar', () => {
    const harga = 1000;
    const persentaseDiskon = 20;
    const hargaSetelahDiskon = countDiscount(harga, persentaseDiskon);
    expect(hargaSetelahDiskon).toBe(800);
  });

  test('setProductsCards harus memiliki kunci yang benar', () => {
    const kartuProduk = setProductsCards(produk);
    expect(kartuProduk[1]).toHaveProperty('price');
    expect(kartuProduk[1]).toHaveProperty('after_discount');
    expect(kartuProduk[1]).toHaveProperty('image');
  });
});
