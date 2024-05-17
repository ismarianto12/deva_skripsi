import express from "express";
import bcrypt from "bcrypt";
import * as BarangController from "../controllers/Barang.js";
import * as JenisController from "../controllers/Jenis.js";
import * as TransaksiController from "../controllers/Transaksi.js";
import * as DistributorController from "../controllers/Distributor.js";
import * as PurhcasingController from "../controllers/Purchasing.js";
import * as LoginController from '../controllers/Users.js'
import { verifyToken } from "../middleware/Auth.js";
import * as ClusterController from '../controllers/Clustering.js'
import crypto from 'crypto';
// import crypto
const router = express.Router();
router.get('/v1', async (req, res) => {
    const generateAccessTokenSecret = () => {
        return crypto.randomBytes(64).toString('hex');
    };
    return res.status(200).json({
        msg: 'beerhasil '
    })
})
router.get('/master/barang', verifyToken, BarangController.BarangList)
router.get('/master/generateKd', verifyToken, BarangController.generateKdbarang)

router.post('/master/barang/create', verifyToken, BarangController.store)
router.post('/master/barang/update/:id', verifyToken, BarangController.Update)
router.get('/master/barang/show/:id', verifyToken, BarangController.Edit)
router.post('/master/barang/delete/:id', verifyToken, BarangController.Delete)
// jenis barang
router.get('/master/jenis', verifyToken, JenisController.ListJenis)
router.post('/master/jenis/create', verifyToken, JenisController.Create)
router.post('/master/jenis/show/:id', verifyToken, JenisController.Show)
router.post('/master/jenis/delete/:id', verifyToken, JenisController.Delete)

//transaksi 
router.get('/master/transaksi', verifyToken, TransaksiController.List)
router.post('/master/transaksi/crate', verifyToken, TransaksiController.Create)
router.post('/master/transaksi/show/:id', verifyToken, TransaksiController.Show)
router.delete('/master/transaksi/delete/:id', verifyToken, TransaksiController.Delete)

// jenis transaksi barang
router.get('/master/distributor', verifyToken, DistributorController.DistributorList)
router.post('/master/distributor/crate', verifyToken, DistributorController.Store)
router.post('/master/distributor/show/:id', verifyToken, DistributorController.Create)
router.delete('/master/distributor/delete/:id', verifyToken, DistributorController.Delete)
router.post('/report/distributor/print/:id', verifyToken, DistributorController.Print)

// purcahsing 
router.get('/master/purcashing', verifyToken, PurhcasingController.Index)
router.post('/master/purchasing/insert', verifyToken, PurhcasingController.Insert)
router.post('/master/purchasing/print/:id', verifyToken, PurhcasingController.Print)
router.post('/master/purchasing/show/:id', verifyToken, PurhcasingController.Edit)
router.delete('/master/purchasing/delete/:id', verifyToken, PurhcasingController.Delete)

router.post('/createcenteroid',verifyToken,ClusterController.createcenteroid)
//action crud users
router.get('/master/kelompokcluster/list', verifyToken, ClusterController.listClustering)

router.get('/logic/clustering/list', verifyToken, ClusterController.List)
router.get('/logic/clustering/clusteresult', verifyToken, ClusterController.ClusterResult)

router.get('/logic/clustering/hitung', verifyToken, ClusterController.hitungClustering)

router.post('/master/purchasing/delete/:id', verifyToken, PurhcasingController.Delete)
router.get('/master/purchasing/delete/:id', verifyToken, PurhcasingController.Delete)


router.post('/report/barang/print/:id', verifyToken, BarangController.Print)
router.get('/master/users', verifyToken, LoginController.List)
// 
router.post('/login', LoginController.Login)
router.post('/user/edit/:id', LoginController.GetUser)
//barang masuk
// router.get('/master/barangmasuk', PurchaseList)
// router.post('/master/barangmasuk/crate', PurchaseCreate)
// router.post('/master/barangmasuk/show/:id', PurchaseShow)
// router.delete('/master/barangmasuk/delete/:id', PurchaseDelete)


export default router;