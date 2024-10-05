import { useUser } from "@clerk/nextjs";
import { CardContent, Container, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Container from "@mui/material";

export default function Flashcard(){
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashCards, setFlashCards] = useState([]); //maintaining set of flashcards for each user
    const router = useRouter(); //for navigation
    const handleCardClick = (id) =>{
        router.push(`/flashcard?id=${id}`)
    }


    useEffect(() => {
        async function getFlashCards(){
            if(!user) return //user is not found in useUser()

            const docRef = doc(collection(db,'users'),user.id); //reference to the collection, gets from database the document of a specific user

            const docSnap = await getDoc(docRef) //get the snapshot of the database fro the user

            if(docSnap().exists()){
                const collections = docSnap.data().flashcards || [];

                setFlashCards(collections);
            }

            //get the flashcards of the user or return empty array. if snapshot doesnt exist create an empty array for the user as flashcards 
            else{
                setDoc(docRef,{ flashCards : [] })
            }


        }
        getFlashCards();
    },[user]) //useEffect works when user changes

    return(
        <Container maxWidth = "md">
            <Grid container spacing = {3} sx = {{ mt:4 }}>
                {flashCards.map((flashcard,index) => (
                    <Grid item xs = {12} sm = {6} md = {4} key = {index}>
                        <Card>
                            <CardActionArea onClick = {() => handleCardClick(flashcard.name)

                            }>
                                <CardContent>
                                    <Typography variant = "h5" component="div">
                                        {flashcard.name}
                                    </Typography>
                                </CardContent>

                            </CardActionArea>

                        </Card>

                    </Grid>
                ))}

            </Grid>
        </Container>
    )
}