import React, { useState, useEffect } from 'react';
import { createCategory, categoryImage } from '@/axios/fetch';
import Button1 from '../ui/button1';
import backgroundImage from "../../assets/backgroundImage.png";
import CardCategory from "@/components/Cards/CardCategory";

const NewCategory = ({ isOpen, onClose }) => {
    const [category, setCategory] = useState(null);
    const [nameCategory, setNameCategory] = useState('');
    const [phraseCategory, setPhraseCategory] = useState('');
    const [imageCategory, setImageCategory] = useState('');
    const [imagePreview, setImagePreview] = useState('');
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (loading){
            setCategory (
                <div className="flex flex-wrap w-full h-full justify-center items-center bg-color-bg ">
                    <div role="status">
                        <svg
                            aria-hidden="true"
                            className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                            />
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                            />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>
                </div>
            );
        }
    },[loading]);

    if (!isOpen)return null;

    const handleNameChange = (event) => {
        const name = event.target.value;
        const phrase = phraseCategory || 'Eslogan';
        const image = imagePreview;
        setNameCategory(name);
        setCategory(<CardCategory name={name} description={phrase} image={image} notHover={true} notOnClick={true}/>);
    };

    const handlePhraseChange = (event) => {
        const phrase = event.target.value;
        const name = nameCategory || 'Categoría';
        const image = imagePreview;
        setPhraseCategory(phrase);
        setCategory(<CardCategory name={name} description={phrase} image={image} notHover={true} notOnClick={true}/>);
    };

    const handleImageChange = (event) => {
        const image = event.target.files[0];
        const imageUrl = URL.createObjectURL(image);
        setImagePreview(imageUrl);
        const name = nameCategory || 'Categoría';
        const phrase = phraseCategory || 'Eslogan';
        setImageCategory(image);
        setCategory(<CardCategory name={name} description={phrase} image={imageUrl} notHover={true} notOnClick={true}/>);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await createCategory(nameCategory, phraseCategory);
            if (response.status === 201) {
                try {
                    const responseImage = await categoryImage(imageCategory, response.data.id);
                    if (responseImage.status === 201) {
                        window.location.reload();
                    }
                } catch (error) {
                    setLoading(false);
                    setError(error.response.data.message);
                }
            }
        } catch (error) {
            setLoading(false);
            setError(error.response.data.message);
        }
    };

    const close = () => {
        setCategory(null);
        setNameCategory('');
        setPhraseCategory('');
        setImageCategory('');
        setImagePreview('');
        setError("");
        onClose();
    };

    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-10" onClick={close}>
            <div className="bg-color-bg p-5 rounded-md relative border-2 border-color-secondary w-1/2 h-3/4 min-h-[580px]" style={{backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover", backgroundPosition: "center"}} onClick={e => e.stopPropagation()}>
                <h1 className="text-3xl font-title font-bold text-color-secondary text-center">Nueva Categoría</h1>
                <form className='flex flex-col h-full justify-around py-10 items-center' onSubmit={handleSubmit}>
                    <input id='name'type="text" placeholder="Nombre de la categoría" className='min-w-56 w-1/2 px-3 py-2 rounded-md font-semibold text-color-bg' value={nameCategory} onChange={handleNameChange} required />
                    {error && <div className="text-red-500 font-semibold">{error}</div>}
                    <input type="text" placeholder='Eslogan' className='min-w-56 w-1/2 px-3 py-2 rounded-md font-semibold text-color-bg' value={phraseCategory} onChange={handlePhraseChange} required/>
                    <input type="file" className="w-1/2 font-semibold"  accept="image/*" onChange={handleImageChange} required/>
                    <h1 className='font-bold text-color-secondary text-xl'>Previsualización</h1>
                    <div className='min-w-56 h-3/5 w-1/2 bg-color-bg rounded-md flex justify-center items-center'>
                        {category}
                    </div>
                    <div className='flex justify-around w-1/2 min-w-56'>
                        <Button1 type={"button"} text={"Cancelar"} onClick={close} />
                        <Button1 type={"submit"} variant={"confirm"} text={"Aceptar"} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NewCategory;