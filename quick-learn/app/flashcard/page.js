import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Flashcard(){
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashCards] = useState([]);
    const [flipped, setFlipped] = useState({});

    const searchParams = useSearchParams();
    search = searchParams.get('id');

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    useEffect(() => {
        async function getFlashCard(){
            if(!search || !user) return

            const colRef = collection(doc(collection(db,'users'),user.id),search)
            const docs = await getDocs(colRef);
            const flashcards = [];
            docs.forEach((doc) => {
                flashcards.push({
                    id: doc.id, ...doc.data()
                })
            })
            setFlashCards(flashcards);
        }
        getFlashCard()
    }, [search, user])

    return(
        
            <Container maxWidth="md">
              <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard) => (
                  <Grid item xs={12} sm={6} md={4} key={flashcard.id}>
                    <Card>
                      <CardActionArea onClick={() => handleCardClick(flashcard.id)}>
                        <CardContent>
                          <Box sx={{ /* Styling for flip animation */ }}>
                            <div>
                              <div>
                                <Typography variant="h5" component="div">
                                  {flashcard.front}
                                </Typography>
                              </div>
                              <div>
                                <Typography variant="h5" component="div">
                                  {flashcard.back}
                                </Typography>
                              </div>
                            </div>
                          </Box>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          )
    
}