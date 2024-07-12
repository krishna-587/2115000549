import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Grid, Card, CardContent, Typography, TextField, MenuItem, Slider, Button } from '@mui/material';

const companies = ["AMZ", "FLP", "SNP", "MYN", "AZO"];
const categories = ["Phone", "Computer", "TV", "Earphone", "Tablet", "Charger", "Mouse", "Keypad", "Bluetooth", "Pendrive", "Remote", "Speaker", "Headset", "Laptop", "PC"];

const mockProducts = [
    {
        productName: "Laptop 1",
        price: 2236,
        rating: 4.7,
        discount: 63,
        availability: "yes"
    },
    {
        productName: "Laptop 2",
        price: 5000,
        rating: 4.8,
        discount: 55,
        availability: "yes"
    },
    {
        productName: "Laptop 3",
        price: 9102,
        rating: 4.44,
        discount: 98,
        availability: "out-of-stock"
    },
    {
        productName: "Laptop 4",
        price: 1244,
        rating: 4.5,
        discount: 45,
        availability: "out-of-stock"
    },
    {
        productName: "Laptop 5",
        price: 2652,
        rating: 4.12,
        discount: 70,
        availability: "yes"
    }
];

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({ company: '', category: '', priceRange: [0, 10000] });

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://20.244.56.144/test/companies/${filters.company}/categories/${filters.category}/products`, {
                params: {
                    top: 10,
                    minPrice: filters.priceRange[0],
                    maxPrice: filters.priceRange[1],
                },
            });
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching the products", error);
            setProducts(mockProducts); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filters.company && filters.category) {
            fetchProducts();
        }
    }, [filters]);

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const handlePriceRangeChange = (event, newValue) => {
        setFilters({ ...filters, priceRange: newValue });
    };

    const handleSubmit = () => {
        fetchProducts();
    };

    return (
        <div>
            <TextField
                select
                label="Company"
                name="company"
                value={filters.company}
                onChange={handleFilterChange}
                fullWidth
            >
                {companies.map((company) => (
                    <MenuItem key={company} value={company}>
                        {company}
                    </MenuItem>
                ))}
            </TextField>
            <TextField
                select
                label="Category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                fullWidth
            >
                {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                        {category}
                    </MenuItem>
                ))}
            </TextField>
            <Typography gutterBottom>
                Price Range
            </Typography>
            <Slider
                value={filters.priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Get Products
            </Button>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={3}>
                    {products.map((product, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h5">{product.productName}</Typography>
                                    <Typography variant="body2">${product.price}</Typography>
                                    <Typography variant="body2">Rating: {product.rating}</Typography>
                                    <Typography variant="body2">Discount: {product.discount}%</Typography>
                                    <Typography variant="body2">{product.availability}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </div>
    );
};

export default AllProducts;
