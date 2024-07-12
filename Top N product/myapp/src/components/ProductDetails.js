import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CircularProgress, Card, CardContent, Typography } from '@mui/material';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://20.244.56.144/test/companies/${id}/categories/${id}/products`);
                setProduct(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching the product", error);
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    return (
        product && (
            <Card>
                <CardContent>
                    <Typography variant="h5">{product.productName}</Typography>
                    <Typography variant="body2">${product.price}</Typography>
                    <Typography variant="body2">Rating: {product.rating}</Typography>
                    <Typography variant="body2">Discount: {product.discount}%</Typography>
                    <Typography variant="body2">{product.availability}</Typography>
                </CardContent>
            </Card>
        )
    );
};

export default ProductDetails;
