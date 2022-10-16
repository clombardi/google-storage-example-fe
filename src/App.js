import axios from "axios";
import { useEffect, useState } from "react";

function App() {
    const [imageData, setImageData] = useState();
    const [pdfData, setPdfData] = useState();
    const [pdfName, setPdfName] = useState("");
    const [launchLoading, setLaunchLoading] = useState(true);

    useEffect(() => {
        const fetchImage = async () => {
            // cfr. https://stackoverflow.com/questions/60454048/how-does-axios-handle-blob-vs-arraybuffer-as-responsetype
            const fetchedData = await axios.get("http://localhost:3123/image", { responseType: "blob" });
            const imageBlob = new Blob([ fetchedData.data ], { type: "image/jpg" });
            const virtualUrl = URL.createObjectURL(imageBlob);
            setImageData(virtualUrl);
        };
        fetchImage();
    }, []);

    useEffect(() => {
        const fetchPdf = async () => {
            const queryParams = pdfName && pdfName.length > 0 ? `?filename=${pdfName}` : "";
            // cfr. https://stackoverflow.com/questions/60454048/how-does-axios-handle-blob-vs-arraybuffer-as-responsetype
            const fetchedData = await axios.get(`http://localhost:3123/pdf${queryParams}`, { responseType: "blob" });
            const pdfBlob = new Blob([ fetchedData.data ], { type: "application/pdf" });
            const virtualUrl = URL.createObjectURL(pdfBlob);
            setPdfData(virtualUrl);
        };
        if (launchLoading) {
            setLaunchLoading(false);
            setPdfData(null);
            fetchPdf();
        }
    }, [launchLoading, pdfName]);

    return (
        <div style={{ display: "flex", flexDirection: "row"}}>
            <div style={{ display: "flex", flexDirection: "column", width: "60%", marginBottom: "2rem"}}>
                <div style={{ display: "flex", flexDirection: "row", marginBottom: "1rem" }}>
                    <div style={{ marginRight: "2rem" }}>Nombre del archivo PDF</div>
                    <div style={{flexGrow: 1}}>
                        <input style={{width: "100%"}} value={pdfName} onChange={
                            event => setPdfName(event.target.value)
                        }/>
                    </div>
                    <div style={{ marginLeft: "2rem" }} onClick={() => {
                        setLaunchLoading(true);
                    }}>
                        <button>Cargar</button>
                    </div>
                </div>
                {pdfData && <div style={{ marginTop: "2rem"}}>
                    Documento PDF desde response de API call
                </div>}
                {pdfData && <div style={{ minHeight: "50rem", }}>
                    { /* https://pspdfkit.com/blog/2018/open-pdf-in-your-web-app/ */ }
                    <object
                        data={pdfData}
                        type="application/pdf"
                        width="100%"
                        height="100%"
                    >
                        Acá viene el PDF
                    </object>
                </div>}
                <div>
                    Imagen desde URL
                </div>
                <div>
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFvm1C2NV1rc0UMR0ek9Q3Qs7M4mzth52lpA&usqp=CAU" 
                        alt="Imagen de ejemplo"
                    />
                </div>
                {imageData && <div style={{ marginTop: "2rem"}}>
                    Imagen desde response de API call
                </div>}
                {imageData && <div>
                    { /* para el scaling, cfr. https://stackoverflow.com/questions/1347675/html-img-scaling */ }
                    <img style={{ height: "400px", width: "auto" }}
                        src={imageData} 
                        alt="Imagen obtenida desde el server"
                    />
                </div>}
            </div>
            <div style={{ marginLeft: "20px" }}>
                Hola
            </div>
        </div>
    );
}

export default App;
