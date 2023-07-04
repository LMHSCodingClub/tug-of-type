import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap"
import { useMutation } from '../convex/_generated/react'
import styles from '../styles/Home.module.css'

const SubmitTextPage = () => {
    const addText = useMutation('text/createText');
    const [newText, setNewText] = useState('');
    const [source, setSource] = useState('');
    const [checked, setChecked] = useState(false);
    const [textSubmissionAlert, setTextSubmissionAlert] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <Head>
                <title>Text Submission Wizard | Tug of Type</title>
                <meta name="description" content="A Typeracer clone built on Convex" />
                <meta name="author" content="LMHS Coding Club" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className={styles.title}>
                    Text Submission Wizard
                </h1>

                <p className={styles.description}>
                    Submit new quotes from books, movies, plays, musical productions, and tv shows to Tug-of-Type
                </p>

                <Alert isOpen={textSubmissionAlert}>Text submitted successfully! Toodloo!</Alert>
                <Form action="" method="post" onSubmit={e => {
                    e.preventDefault();
                    addText({ newText, source })
                    setTextSubmissionAlert(true);
                    setNewText("");
                    setSource("");
                    setChecked(false);
                }}>
                    <FormGroup>
                        <Label htmlFor="words">Add a text to the dealership</Label>
                        <Input minLength={75} required id="words" type="textarea" cols="100" rows="10" style={{ resize: 'none' }} value={newText} onChange={e => setNewText(e.target.value)} />
                        <Label maxLength={150} htmlFor="source">Source - use the format "<strong>Title</strong> by <strong>Author/Playwright</strong>"</Label>
                        <Input required id="source" value={source} onChange={e => setSource(e.target.value)} />
                    </FormGroup>

                    <FormGroup>
                        <Input id="agreement" type="checkbox" required onChange={e => setChecked(e.target.checked)} checked={checked} />
                        <Label htmlFor="agreement" check>I understand that this is a request and my text may not added to the text bank if not approved</Label>
                    </FormGroup>
                    <FormGroup>

                        <Button type="submit" color="primary" className="mt-3">Submit Text</Button>
                    </FormGroup>
                </Form>
            </main>


        </div>
    )
}

export default SubmitTextPage
