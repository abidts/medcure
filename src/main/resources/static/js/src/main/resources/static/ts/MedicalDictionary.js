import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, BookOpen, ChevronRight, History, X, Stethoscope, ArrowLeft, Bookmark, Share2 } from 'lucide-react';
const medicalTerms = [
    {
        id: 'a-1',
        term: 'Abdomen',
        pronunciation: '/ˈæbdəmən/',
        partOfSpeech: 'noun',
        definition: 'The part of the body between the chest and the pelvis that contains the stomach, intestines, liver, and other organs.',
        detailedExplanation: 'The abdomen is the cavity of the human body that holds the digestive organs and is separated from the thorax by the diaphragm. It is bounded superiorly by the thoracic diaphragm and inferiorly by the pelvic brim. The abdominal cavity contains the stomach, small intestine, large intestine, liver, gallbladder, pancreas, spleen, kidneys, and adrenal glands. Pain in the abdomen can indicate various conditions ranging from minor digestive issues to serious medical emergencies.',
        etymology: 'From Latin "abdomen," possibly from abdere meaning "to hide" (referring to the intestines being hidden), or from abdomin- meaning "belly."',
        synonyms: ['belly', 'stomach', 'midsection', 'torso'],
        relatedTerms: ['Abdominal', 'Abdominoplasty', 'Abdominocentesis'],
        category: 'Anatomy',
        commonUsage: 'Used in general medical examinations, surgical procedures, and describing pain or discomfort locations.',
        exampleSentence: 'The patient reported persistent pain in the upper abdomen after meals.',
        firstLetter: 'A'
    },
    {
        id: 'a-2',
        term: 'Abrasion',
        pronunciation: '/əˈbreɪʒən/',
        partOfSpeech: 'noun',
        definition: 'A wound caused by superficial damage to the skin, often resulting from scraping or rubbing against a rough surface.',
        detailedExplanation: 'An abrasion, commonly known as a scrape or graze, occurs when the skin rubs against a rough surface, causing damage to the epidermis and potentially the upper dermis. Unlike cuts or lacerations, abrasions typically do not penetrate deep into the skin but can be painful due to exposure of nerve endings. First aid involves cleaning the wound thoroughly to prevent infection and applying protective ointments or dressings.',
        etymology: 'From Latin "abrasio" meaning "a scraping," from the verb "abradere" meaning "to scrape away" (ab- "away" + radere "to scrape").',
        synonyms: ['scrape', 'graze', 'scratch', 'excoriation'],
        relatedTerms: ['Laceration', 'Contusion', 'Wound healing'],
        category: 'Dermatology',
        commonUsage: 'Commonly used in emergency medicine, sports medicine, and dermatology to describe superficial skin injuries.',
        exampleSentence: 'The child sustained minor abrasions on both knees after falling on the sidewalk.',
        firstLetter: 'A'
    },
    {
        id: 'a-3',
        term: 'Abscess',
        pronunciation: '/ˈæbsɛs/',
        partOfSpeech: 'noun',
        definition: 'A localized collection of pus surrounded by inflamed tissue, typically caused by bacterial infection.',
        detailedExplanation: 'An abscess is a painful, swollen area containing accumulated pus, dead tissue, and white blood cells that have gathered to fight infection. It can occur anywhere in the body, including the skin, organs, and between organs. Common causes include bacterial infections, blocked glands or hair follicles, and foreign objects. Treatment typically involves drainage and antibiotics. Without proper treatment, abscesses can spread infection to surrounding tissues and bloodstream.',
        etymology: 'From Latin "abscessus" meaning "a going away, departure," from the past participle of "abscedere" meaning "to go apart" (ab- "away" + cedere "to go").',
        synonyms: ['boil', 'carbuncle', 'pustule', 'ulceration'],
        relatedTerms: ['Cellulitis', 'Fistula', 'Sepsis'],
        category: 'Infectious Disease',
        commonUsage: 'Frequently used in surgery, dermatology, dentistry, and general practice.',
        exampleSentence: 'The dentist drained the dental abscess and prescribed antibiotics to clear the infection.',
        firstLetter: 'A'
    },
    {
        id: 'a-4',
        term: 'Acute',
        pronunciation: '/əˈkjuːt/',
        partOfSpeech: 'adjective',
        definition: 'Describes a condition or symptom that has a rapid onset, severe symptoms, and relatively short duration.',
        detailedExplanation: 'In medical terminology, "acute" refers to conditions that develop suddenly and often require immediate attention. Acute conditions are typically contrasted with "chronic" conditions, which develop slowly and persist over a long time. Acute diseases often have severe symptoms initially but may resolve completely with proper treatment. Examples include acute appendicitis, acute myocardial infarction (heart attack), and acute respiratory infections.',
        etymology: 'From Latin "acutus" meaning "sharp, pointed, keen," from the verb "acuere" meaning "to sharpen."',
        synonyms: ['sudden', 'severe', 'intense', 'critical'],
        relatedTerms: ['Chronic', 'Subacute', 'Peracute'],
        category: 'Medical Terminology',
        commonUsage: 'Used across all medical specialties to describe the severity and timeline of conditions.',
        exampleSentence: 'The patient was admitted with acute chest pain suggestive of myocardial infarction.',
        firstLetter: 'A'
    },
    {
        id: 'a-5',
        term: 'Antibiotic',
        pronunciation: '/ˌæntɪbaɪˈɒtɪk/',
        partOfSpeech: 'noun',
        definition: 'A substance that inhibits the growth of or destroys microorganisms, particularly bacteria.',
        detailedExplanation: 'Antibiotics are medicines that fight bacterial infections by killing bacteria or preventing them from multiplying. They are ineffective against viral infections like the common cold or flu. The discovery of penicillin by Alexander Fleming in 1928 revolutionized medicine. However, overuse and misuse have led to antibiotic resistance, a major global health threat. Common classes include penicillins, cephalosporins, macrolides, fluoroquinolones, and tetracyclines.',
        etymology: 'From Greek "anti" meaning "against" + "biotikos" meaning "fit for life, relating to life" (from "bios" meaning "life").',
        synonyms: ['antibacterial', 'antimicrobial', 'bactericide'],
        relatedTerms: ['Antimicrobial', 'Penicillin', 'Antibiotic resistance'],
        category: 'Pharmacology',
        commonUsage: 'Essential in treating bacterial infections across all medical fields.',
        exampleSentence: 'The physician prescribed a broad-spectrum antibiotic to treat the bacterial pneumonia.',
        firstLetter: 'A'
    },
    {
        id: 'b-1',
        term: 'Bacteria',
        pronunciation: '/bækˈtɪəriə/',
        partOfSpeech: 'noun',
        definition: 'Microscopic, single-celled organisms that can be found in diverse environments, including soil, water, and the human body.',
        detailedExplanation: 'Bacteria are prokaryotic microorganisms that lack a membrane-bound nucleus. While many bacteria are beneficial (such as gut flora that aid digestion), others cause diseases like tuberculosis, pneumonia, and food poisoning. Bacteria reproduce through binary fission and can develop resistance to antibiotics through genetic mutation and horizontal gene transfer. They are classified by shape (cocci, bacilli, spirilla) and by Gram staining (Gram-positive or Gram-negative).',
        etymology: 'From New Latin "bacteria," plural of "bacterium," from Greek "baktērion" meaning "small staff, rod," diminutive of "baktron" meaning "staff, rod."',
        synonyms: ['microbes', 'microorganisms', 'germs', 'pathogens'],
        relatedTerms: ['Virus', 'Fungi', 'Prokaryote', 'Microbiome'],
        category: 'Microbiology',
        commonUsage: 'Fundamental term in infectious disease, microbiology, and immunology.',
        exampleSentence: 'Laboratory tests confirmed the presence of gram-negative bacteria in the patient\'s blood culture.',
        firstLetter: 'B'
    },
    {
        id: 'b-2',
        term: 'Biopsy',
        pronunciation: '/ˈbaɪɒpsi/',
        partOfSpeech: 'noun',
        definition: 'A medical procedure involving the removal of tissue samples for examination to determine the presence or extent of disease.',
        detailedExplanation: 'A biopsy is a definitive diagnostic procedure used to identify cancer, infections, inflammatory conditions, and other diseases. Types include needle biopsy (fine-needle aspiration or core needle), incisional biopsy (removing part of a lesion), excisional biopsy (removing the entire lesion), and endoscopic biopsy. The tissue sample is processed, stained, and examined microscopically by a pathologist. Molecular and genetic testing may also be performed on biopsy samples.',
        etymology: 'From Greek "bios" meaning "life" + "opsis" meaning "a sight, view" (from "ops" meaning "eye, face").',
        synonyms: ['tissue sampling', 'histopathology', 'cytology'],
        relatedTerms: ['Histology', 'Cytology', 'Pathology', 'Excision'],
        category: 'Pathology',
        commonUsage: 'Essential in oncology, dermatology, gastroenterology, and most medical specialties.',
        exampleSentence: 'The suspicious mole was sent for biopsy to rule out malignant melanoma.',
        firstLetter: 'B'
    },
    {
        id: 'b-3',
        term: 'Blood Pressure',
        pronunciation: '/blʌd ˈprɛʃər/',
        partOfSpeech: 'noun',
        definition: 'The force exerted by circulating blood against the walls of blood vessels, primarily arteries.',
        detailedExplanation: 'Blood pressure is measured in millimeters of mercury (mmHg) and recorded as two numbers: systolic pressure (the force when the heart beats) over diastolic pressure (the force when the heart rests between beats). Normal blood pressure is typically around 120/80 mmHg. Hypertension (high blood pressure) increases the risk of heart disease, stroke, and kidney disease. Hypotension (low blood pressure) can cause dizziness and fainting.',
        etymology: 'Old English "blod" + Latin "pressura" meaning "pressure, compressing force," from "pressus," past participle of "premere" meaning "to press."',
        synonyms: ['arterial pressure', 'circulatory pressure', 'BP'],
        relatedTerms: ['Hypertension', 'Hypotension', 'Systolic', 'Diastolic'],
        category: 'Cardiology',
        commonUsage: 'One of the most common vital signs measured in all healthcare settings.',
        exampleSentence: 'The nurse recorded the patient\'s blood pressure as 130/85 mmHg, slightly elevated from the previous reading.',
        firstLetter: 'B'
    },
    {
        id: 'c-1',
        term: 'Chronic',
        pronunciation: '/ˈkrɒnɪk/',
        partOfSpeech: 'adjective',
        definition: 'Describes a condition that persists for a long time, typically lasting three months or more.',
        detailedExplanation: 'Chronic conditions develop gradually and persist over extended periods, often for a lifetime. They contrast with acute conditions that develop rapidly and resolve quickly. Chronic diseases include diabetes, hypertension, asthma, arthritis, and heart disease. These conditions often require ongoing management rather than cure. Chronic disease management focuses on symptom control, preventing complications, and maintaining quality of life.',
        etymology: 'From Greek "khronikos" meaning "of time, concerning time," from "khronos" meaning "time."',
        synonyms: ['long-term', 'persistent', 'ongoing', 'enduring'],
        relatedTerms: ['Acute', 'Subacute', 'Chronicity', 'Comorbidity'],
        category: 'Medical Terminology',
        commonUsage: 'Used across all specialties to describe disease duration and progression.',
        exampleSentence: 'She was diagnosed with chronic obstructive pulmonary disease after years of smoking.',
        firstLetter: 'C'
    },
    {
        id: 'c-2',
        term: 'Computed Tomography',
        pronunciation: '/kəmˈpjuːtɪd təˈmɒɡrəfi/',
        partOfSpeech: 'noun',
        definition: 'A medical imaging technique that uses X-rays and computer processing to create cross-sectional images of the body.',
        detailedExplanation: 'CT scanning combines multiple X-ray images taken from different angles to produce detailed cross-sectional images (slices) of bones, blood vessels, and soft tissues. It provides more detailed information than standard X-rays and is particularly useful for detecting tumors, internal injuries, blood clots, and bone fractures. CT scans involve ionizing radiation, so their use is balanced against potential risks. Contrast agents may be used to enhance visibility of certain structures.',
        etymology: 'English "computed" (from Latin "computare" meaning "to calculate") + Greek "tomos" meaning "a cutting, slice" + "graphein" meaning "to write."',
        synonyms: ['CT scan', 'CAT scan', 'Computerized Axial Tomography'],
        relatedTerms: ['MRI', 'X-ray', 'Radiology', 'Imaging'],
        category: 'Radiology',
        commonUsage: 'Standard diagnostic tool in emergency medicine, oncology, and trauma assessment.',
        exampleSentence: 'The CT scan revealed a small subdural hematoma requiring immediate neurosurgical consultation.',
        firstLetter: 'C'
    },
    {
        id: 'd-1',
        term: 'Diagnosis',
        pronunciation: '/ˌdaɪəɡˈnəʊsɪs/',
        partOfSpeech: 'noun',
        definition: 'The identification of the nature and cause of a disease or condition through examination and testing.',
        detailedExplanation: 'Diagnosis is the process of determining which disease or condition explains a person\'s symptoms and signs. It involves taking a medical history, performing physical examinations, and conducting diagnostic tests. A differential diagnosis considers multiple possible conditions that could cause similar symptoms. Accurate diagnosis is essential for appropriate treatment planning. The plural form is "diagnoses."',
        etymology: 'From Greek "diagnosis" meaning "discrimination, distinguishing, discernment," from "diagignoskein" meaning "to distinguish, discern" (dia- "through, thoroughly" + gignoskein "to know, recognize").',
        synonyms: ['identification', 'determination', 'recognition', 'conclusion'],
        relatedTerms: ['Differential diagnosis', 'Prognosis', 'Symptomatology'],
        category: 'Medical Practice',
        commonUsage: 'Core concept in all medical decision-making and clinical reasoning.',
        exampleSentence: 'After reviewing the lab results and imaging studies, the physician confirmed the diagnosis of acute appendicitis.',
        firstLetter: 'D'
    },
    {
        id: 'd-2',
        term: 'Diabetes Mellitus',
        pronunciation: '/ˌdaɪəˈbiːtiːz məˈlaɪtəs/',
        partOfSpeech: 'noun',
        definition: 'A metabolic disorder characterized by high blood glucose levels over a prolonged period due to insufficient insulin production or action.',
        detailedExplanation: 'Diabetes mellitus is a group of metabolic diseases where the body cannot properly regulate blood glucose. Type 1 diabetes results from autoimmune destruction of insulin-producing beta cells. Type 2 diabetes involves insulin resistance and relative insulin deficiency. Gestational diabetes occurs during pregnancy. Complications include cardiovascular disease, nephropathy, retinopathy, and neuropathy. Management involves blood glucose monitoring, medication, diet, and exercise.',
        etymology: 'From Greek "diabetes" meaning "siphon, passer-through" (referring to excessive urination) + Latin "mellitus" meaning "sweetened with honey" (referring to sweet urine).',
        synonyms: ['diabetes', 'sugar diabetes', 'hyperglycemia'],
        relatedTerms: ['Insulin', 'Hyperglycemia', 'Hypoglycemia', 'A1C'],
        category: 'Endocrinology',
        commonUsage: 'One of the most common chronic diseases worldwide, treated by endocrinologists and primary care physicians.',
        exampleSentence: 'The patient\'s uncontrolled diabetes mellitus led to progressive diabetic retinopathy.',
        firstLetter: 'D'
    },
    {
        id: 'e-1',
        term: 'Epidemic',
        pronunciation: '/ˌɛpɪˈdɛmɪk/',
        partOfSpeech: 'noun/adjective',
        definition: 'The rapid spread of an infectious disease to a large number of people in a given population within a short period.',
        detailedExplanation: 'An epidemic occurs when the incidence of a disease exceeds what is normally expected in a population or geographic area. Epidemics can be caused by new pathogens, changes in pathogen virulence, or decreased population immunity. Public health measures include surveillance, vaccination, quarantine, and contact tracing. A pandemic is an epidemic that spreads across multiple countries or continents.',
        etymology: 'From Greek "epidemios" meaning "prevalent, among the people," from "epi" meaning "upon, among" + "demos" meaning "people."',
        synonyms: ['outbreak', 'spread', 'plague', 'pestilence'],
        relatedTerms: ['Pandemic', 'Endemic', 'Epidemiology', 'Outbreak'],
        category: 'Public Health',
        commonUsage: 'Central concept in epidemiology and public health surveillance.',
        exampleSentence: 'The rapid transmission led to an influenza epidemic affecting thousands in the region.',
        firstLetter: 'E'
    },
    {
        id: 'f-1',
        term: 'Fracture',
        pronunciation: '/ˈfræktʃər/',
        partOfSpeech: 'noun',
        definition: 'A break in the continuity of a bone, ranging from a thin crack to a complete break.',
        detailedExplanation: 'Fractures can be classified by their pattern (transverse, oblique, spiral, comminuted), location, and whether the bone breaks through the skin (open/compound) or not (closed/simple). Common causes include trauma, falls, sports injuries, and conditions that weaken bones like osteoporosis. Treatment may involve immobilization with casts or splints, external fixation, or surgical internal fixation. Healing involves inflammation, soft callus formation, hard callus formation, and remodeling phases.',
        etymology: 'From Latin "fractura" meaning "a breach, break," from "frangere" meaning "to break."',
        synonyms: ['break', 'crack', 'fissure', 'rupture'],
        relatedTerms: ['Dislocation', 'Sprain', 'Osteoporosis', 'Cast'],
        category: 'Orthopedics',
        commonUsage: 'Common in emergency medicine, orthopedics, sports medicine, and trauma care.',
        exampleSentence: 'The X-ray confirmed a comminuted fracture of the distal radius requiring surgical fixation.',
        firstLetter: 'F'
    },
    {
        id: 'g-1',
        term: 'Genetics',
        pronunciation: '/dʒəˈnɛtɪks/',
        partOfSpeech: 'noun',
        definition: 'The study of genes, genetic variation, and heredity in living organisms.',
        detailedExplanation: 'Medical genetics examines how genetic variations affect human health and disease. It includes the study of chromosomal abnormalities, single gene disorders (like cystic fibrosis or sickle cell anemia), multifactorial inheritance, and mitochondrial disorders. Genetic counseling helps families understand and adapt to genetic conditions. Advances in genetic testing and gene therapy are transforming medicine, enabling personalized treatments based on individual genetic profiles.',
        etymology: 'From Greek "genetikos" meaning "genitive, productive," from "genesis" meaning "origin, generation."',
        synonyms: ['heredity', 'inheritance', 'genomics', 'molecular biology'],
        relatedTerms: ['Genome', 'Chromosome', 'DNA', 'Mutation', 'Genetic counseling'],
        category: 'Genetics',
        commonUsage: 'Essential in understanding inherited diseases, cancer biology, and personalized medicine.',
        exampleSentence: 'Advances in genetics have enabled early detection of hereditary cancer syndromes.',
        firstLetter: 'G'
    },
    {
        id: 'h-1',
        term: 'Hypertension',
        pronunciation: '/ˌhaɪpərˈtɛnʃən/',
        partOfSpeech: 'noun',
        definition: 'A medical condition characterized by persistently elevated blood pressure in the arteries.',
        detailedExplanation: 'Hypertension, or high blood pressure, is defined as sustained readings of 130/80 mmHg or higher. It is a major risk factor for cardiovascular disease, stroke, kidney disease, and vision loss. Primary (essential) hypertension has no identifiable cause, while secondary hypertension results from underlying conditions like kidney disease or hormonal disorders. The "silent killer" often presents no symptoms but causes progressive organ damage. Management includes lifestyle modifications and antihypertensive medications.',
        etymology: 'From Greek "hyper" meaning "over, above, excessive" + Latin "tensio" meaning "a stretching, tension," from "tendere" meaning "to stretch."',
        synonyms: ['high blood pressure', 'HTN', 'arterial hypertension'],
        relatedTerms: ['Hypotension', 'Blood pressure', 'Cardiovascular disease'],
        category: 'Cardiology',
        commonUsage: 'One of the most common chronic conditions, managed in primary care and cardiology.',
        exampleSentence: 'Uncontrolled hypertension significantly increases the risk of stroke and myocardial infarction.',
        firstLetter: 'H'
    },
    {
        id: 'i-1',
        term: 'Immunization',
        pronunciation: '/ˌɪmjʊnaɪˈzeɪʃən/',
        partOfSpeech: 'noun',
        definition: 'The process by which an individual becomes protected against a disease through vaccination.',
        detailedExplanation: 'Immunization stimulates the immune system to produce antibodies and memory cells that provide protection against specific pathogens. Vaccines contain weakened or inactivated pathogens, parts of pathogens, or genetic material that triggers an immune response. Herd immunity occurs when a sufficient percentage of a population is immunized, protecting those who cannot be vaccinated. Immunization has eliminated or dramatically reduced diseases like smallpox, polio, measles, and diphtheria.',
        etymology: 'From Latin "immunis" meaning "exempt, free" (from in- "not" + munus "service, duty") + "-ization" meaning "the process of making."',
        synonyms: ['vaccination', 'inoculation', 'immunoprophylaxis'],
        relatedTerms: ['Vaccine', 'Immunity', 'Antibody', 'Herd immunity'],
        category: 'Immunology',
        commonUsage: 'Fundamental to preventive medicine and public health programs worldwide.',
        exampleSentence: 'Childhood immunization schedules protect against numerous serious infectious diseases.',
        firstLetter: 'I'
    },
    {
        id: 'j-1',
        term: 'Jaundice',
        pronunciation: '/ˈdʒɔːndɪs/',
        partOfSpeech: 'noun',
        definition: 'A yellow discoloration of the skin, mucous membranes, and sclera caused by elevated bilirubin levels.',
        detailedExplanation: 'Jaundice indicates underlying liver dysfunction, hemolysis (excessive red blood cell breakdown), or bile duct obstruction. Bilirubin is a yellow pigment produced during normal breakdown of red blood cells. Types include pre-hepatic (hemolytic), hepatic (liver disease), and post-hepatic (obstructive) jaundice. Newborn jaundice is common and usually resolves, but severe cases require phototherapy. Adult jaundice requires investigation to identify the underlying cause through liver function tests, imaging, and sometimes liver biopsy.',
        etymology: 'From Old French "jaunisse" meaning "yellowish," from "jaune" meaning "yellow," from Latin "galbinus" meaning "greenish-yellow."',
        synonyms: ['icterus', 'yellowing', 'hyperbilirubinemia'],
        relatedTerms: ['Bilirubin', 'Hepatitis', 'Cirrhosis', 'Gallstones'],
        category: 'Hepatology',
        commonUsage: 'Important diagnostic sign in gastroenterology, hepatology, and neonatology.',
        exampleSentence: 'The patient presented with jaundice and dark urine, prompting immediate liver function testing.',
        firstLetter: 'J'
    },
    {
        id: 'k-1',
        term: 'Ketosis',
        pronunciation: '/kɪˈtəʊsɪs/',
        partOfSpeech: 'noun',
        definition: 'A metabolic state characterized by elevated levels of ketone bodies in the blood or tissues.',
        detailedExplanation: 'Ketosis occurs when the body burns fat for fuel instead of carbohydrates, producing ketone bodies (acetoacetate, beta-hydroxybutyrate, and acetone). Physiological ketosis can result from fasting, prolonged exercise, or very low-carbohydrate diets. Pathological ketosis occurs in diabetes (diabetic ketoacidosis), a life-threatening emergency. Ketone testing is important for managing type 1 diabetes. The "keto diet" intentionally induces mild ketosis for weight loss.',
        etymology: 'From German "Keton" meaning "ketone" (chemical compound) + Greek "-osis" meaning "condition, state."',
        synonyms: ['ketonaemia', 'ketonuria', 'ketogenic state'],
        relatedTerms: ['Ketones', 'Diabetic ketoacidosis', 'Ketogenic diet', 'Metabolism'],
        category: 'Metabolism',
        commonUsage: 'Relevant in diabetes management, nutrition, and metabolic medicine.',
        exampleSentence: 'Diabetic ketoacidosis results from severe insulin deficiency and requires emergency treatment.',
        firstLetter: 'K'
    },
    {
        id: 'l-1',
        term: 'Leukocyte',
        pronunciation: '/ˈluːkəʊsaɪt/',
        partOfSpeech: 'noun',
        definition: 'A white blood cell that plays a crucial role in the immune system\'s defense against infections.',
        detailedExplanation: 'Leukocytes, or white blood cells, are colorless blood cells that protect the body against infectious disease and foreign invaders. Types include neutrophils (most abundant, fight bacteria), lymphocytes (B cells produce antibodies, T cells destroy infected cells), monocytes (become macrophages), eosinophils (fight parasites, involved in allergies), and basophils (release histamine). The normal white blood cell count ranges from 4,000 to 11,000 per microliter. Abnormal counts indicate infection, inflammation, or blood disorders.',
        etymology: 'From Greek "leukos" meaning "white, bright, clear" + "kytos" meaning "cell, hollow vessel."',
        synonyms: ['white blood cell', 'WBC', 'white corpuscle'],
        relatedTerms: ['Erythrocyte', 'Thrombocyte', 'Immunity', 'Leukemia'],
        category: 'Hematology',
        commonUsage: 'Fundamental to immunology, hematology, and infectious disease diagnosis.',
        exampleSentence: 'The elevated leukocyte count indicated an active bacterial infection requiring antibiotic therapy.',
        firstLetter: 'L'
    },
    {
        id: 'm-1',
        term: 'Malignant',
        pronunciation: '/məˈlɪɡnənt/',
        partOfSpeech: 'adjective',
        definition: 'Describes a tumor or growth that is cancerous and capable of invading nearby tissues and spreading to distant sites.',
        detailedExplanation: 'A malignant tumor is characterized by uncontrolled growth, invasion into surrounding tissues (invasion), and ability to spread to distant organs through blood or lymph (metastasis). Malignant cells have genetic mutations that disrupt normal cell cycle regulation. Benign tumors, in contrast, grow slowly, remain localized, and do not metastasize. Malignant cancers require aggressive treatment including surgery, chemotherapy, radiation, and targeted therapies.',
        etymology: 'From Latin "malignus" meaning "wicked, malicious, bad-natured," from "malus" meaning "bad" + root of "genus" meaning "born."',
        synonyms: ['cancerous', 'virulent', 'invasive', 'metastatic'],
        relatedTerms: ['Benign', 'Metastasis', 'Carcinoma', 'Sarcoma'],
        category: 'Oncology',
        commonUsage: 'Essential terminology in cancer diagnosis, staging, and treatment planning.',
        exampleSentence: 'Biopsy confirmed the tumor was malignant with evidence of lymph node metastasis.',
        firstLetter: 'M'
    },
    {
        id: 'n-1',
        term: 'Neurotransmitter',
        pronunciation: '/ˌnjʊərəʊˈtrænzmɪtər/',
        partOfSpeech: 'noun',
        definition: 'A chemical substance released by a neuron to transmit signals across a synapse to target cells.',
        detailedExplanation: 'Neurotransmitters are the body\'s chemical messengers that enable communication between nerve cells (neurons) and target cells like other neurons, muscle cells, or glands. Major neurotransmitters include acetylcholine (muscle contraction, memory), dopamine (reward, movement), serotonin (mood, sleep), norepinephrine (alertness, attention), GABA (inhibition), and glutamate (excitation). Imbalances in neurotransmitters are implicated in depression, anxiety, Parkinson\'s disease, and schizophrenia.',
        etymology: 'From Greek "neuron" meaning "nerve, sinew" + Latin "transmittere" meaning "to send across" (trans- "across" + mittere "to send").',
        synonyms: ['chemical messenger', 'neurochemical', 'synaptic transmitter'],
        relatedTerms: ['Synapse', 'Receptor', 'Neuron', 'Dopamine', 'Serotonin'],
        category: 'Neuroscience',
        commonUsage: 'Fundamental to neurology, psychiatry, and understanding brain function.',
        exampleSentence: 'Many antidepressant medications work by increasing serotonin levels at synapses.',
        firstLetter: 'N'
    },
    {
        id: 'o-1',
        term: 'Osteoporosis',
        pronunciation: '/ˌɒstiəʊpəˈrəʊsɪs/',
        partOfSpeech: 'noun',
        definition: 'A bone disease characterized by decreased bone mass and density, leading to increased fracture risk.',
        detailedExplanation: 'Osteoporosis, meaning "porous bone," occurs when the creation of new bone doesn\'t keep up with the removal of old bone. Risk factors include aging, female gender, family history, low body weight, smoking, and certain medications. It often progresses silently until a fracture occurs, commonly in the hip, spine, or wrist. Dual-energy X-ray absorptiometry (DEXA) measures bone density. Treatment includes calcium, vitamin D, weight-bearing exercise, and medications like bisphosphonates.',
        etymology: 'From Greek "osteon" meaning "bone" + "poros" meaning "passage, pore" + "-osis" meaning "condition."',
        synonyms: ['bone loss', 'osteopenia (milder form)', 'skeletal fragility'],
        relatedTerms: ['Fracture', 'Bone density', 'DEXA scan', 'Calcium'],
        category: 'Endocrinology',
        commonUsage: 'Common condition in geriatrics, endocrinology, and women\'s health.',
        exampleSentence: 'Postmenopausal women should be screened for osteoporosis to prevent fragility fractures.',
        firstLetter: 'O'
    },
    {
        id: 'p-1',
        term: 'Pathology',
        pronunciation: '/pəˈθɒlədʒi/',
        partOfSpeech: 'noun',
        definition: 'The study of the causes, processes, development, and consequences of diseases.',
        detailedExplanation: 'Pathology bridges basic science and clinical medicine by examining how diseases affect cells, tissues, and organs. Branches include anatomical pathology (study of tissue specimens), clinical pathology (laboratory medicine), forensic pathology, and molecular pathology. Pathologists analyze biopsy specimens, perform autopsies, and oversee laboratory testing. Their diagnoses guide treatment decisions, particularly in cancer care. Modern pathology increasingly incorporates molecular and genetic testing.',
        etymology: 'From Greek "pathologia" meaning "study of the emotions or of suffering," from "pathos" meaning "suffering, disease" + "-logia" meaning "study of."',
        synonyms: ['disease study', 'histopathology', 'morbid anatomy'],
        relatedTerms: ['Pathologist', 'Histology', 'Cytology', 'Biopsy'],
        category: 'Pathology',
        commonUsage: 'Foundation of medical diagnosis and understanding disease mechanisms.',
        exampleSentence: 'The pathology report confirmed the presence of malignant cells with metastatic potential.',
        firstLetter: 'P'
    },
    {
        id: 'q-1',
        term: 'Quarantine',
        pronunciation: '/ˈkwɒrəntiːn/',
        partOfSpeech: 'noun/verb',
        definition: 'The restriction of movement and separation of individuals who may have been exposed to an infectious disease.',
        detailedExplanation: 'Quarantine is used to prevent the spread of contagious diseases by isolating potentially infected individuals during the incubation period. Unlike isolation (which separates confirmed cases), quarantine applies to exposed but asymptomatic individuals. Historical quarantine periods were 40 days (hence the name, from Italian "quaranta giorni"). Modern quarantine includes home confinement, monitoring symptoms, and testing. It is a critical public health tool for controlling outbreaks of diseases like COVID-19, Ebola, and tuberculosis.',
        etymology: 'From Italian "quaranta giorni" meaning "40 days," the period ships were required to isolate during the Black Death in Venice (1377).',
        synonyms: ['isolation', 'segregation', 'confinement', 'lockdown'],
        relatedTerms: ['Isolation', 'Incubation period', 'Public health', 'Contact tracing'],
        category: 'Public Health',
        commonUsage: 'Essential tool in infectious disease control and epidemic management.',
        exampleSentence: 'Travelers from high-risk areas were placed under mandatory quarantine for 14 days.',
        firstLetter: 'Q'
    },
    {
        id: 'r-1',
        term: 'Remission',
        pronunciation: '/rɪˈmɪʃən/',
        partOfSpeech: 'noun',
        definition: 'A period during which symptoms of a disease decrease or disappear.',
        detailedExplanation: 'In cancer, remission means a decrease in or disappearance of signs and symptoms. Complete remission indicates all signs of cancer are gone; partial remission means cancer has partially responded to treatment. Remission is not synonymous with cure, as cancer cells may remain undetectable. In chronic diseases like multiple sclerosis or rheumatoid arthritis, remission refers to periods of reduced disease activity. The term can also apply to mental health disorders, where symptoms improve significantly.',
        etymology: 'From Latin "remissio" meaning "a sending back, relaxing, releasing," from "remittere" meaning "to send back" (re- "back" + mittere "to send").',
        synonyms: ['abatement', 'subsidence', 'resolution', 'improvement'],
        relatedTerms: ['Relapse', 'Cure', 'Response to treatment', 'Disease-free survival'],
        category: 'Oncology',
        commonUsage: 'Important outcome measure in oncology, psychiatry, and chronic disease management.',
        exampleSentence: 'The patient achieved complete remission following six months of chemotherapy.',
        firstLetter: 'R'
    },
    {
        id: 's-1',
        term: 'Symptom',
        pronunciation: '/ˈsɪmptəm/',
        partOfSpeech: 'noun',
        definition: 'A physical or mental feature that indicates the presence of a disease or condition, as experienced by the patient.',
        detailedExplanation: 'Symptoms are subjective experiences reported by patients, distinguishing them from signs (objective findings observed by clinicians). Common symptoms include pain, fatigue, nausea, dizziness, anxiety, and mood changes. Symptomatology is the study of symptoms. Accurate symptom description helps clinicians form differential diagnoses. Some symptoms are specific to certain diseases (pathognomonic), while others are nonspecific. Quality of life assessments often focus on symptom burden.',
        etymology: 'From Late Latin "symptoma," from Greek "symptoma" meaning "a happening, accident, disease symptom," from "sympiptein" meaning "to befall, happen together."',
        synonyms: ['indication', 'manifestation', 'complaint', 'feature'],
        relatedTerms: ['Sign', 'Syndrome', 'Differential diagnosis', 'Subjective'],
        category: 'Medical Terminology',
        commonUsage: 'Fundamental concept in patient history-taking and clinical assessment.',
        exampleSentence: 'Chest pain is a symptom that requires immediate evaluation to rule out cardiac causes.',
        firstLetter: 'S'
    },
    {
        id: 't-1',
        term: 'Thrombosis',
        pronunciation: '/θrɒmˈbəʊsɪs/',
        partOfSpeech: 'noun',
        definition: 'The formation of a blood clot (thrombus) inside a blood vessel, obstructing blood flow.',
        detailedExplanation: 'Thrombosis can occur in arteries or veins. Deep vein thrombosis (DVT) typically affects leg veins and can lead to pulmonary embolism if the clot dislodges. Arterial thrombosis causes heart attacks and strokes. Risk factors include immobility, surgery, pregnancy, oral contraceptives, cancer, and inherited clotting disorders. Virchow\'s triad describes the three factors promoting thrombosis: stasis, hypercoagulability, and endothelial injury. Treatment involves anticoagulants; severe cases may require thrombolytics or surgical intervention.',
        etymology: 'From New Latin "thrombosis," from Greek "thrombos" meaning "clot, lump, curd of milk" + "-osis" meaning "condition."',
        synonyms: ['clotting', 'coagulation', 'embolism (when clot moves)', 'occlusion'],
        relatedTerms: ['Embolism', 'Deep vein thrombosis', 'Pulmonary embolism', 'Anticoagulant'],
        category: 'Hematology',
        commonUsage: 'Critical condition in cardiology, emergency medicine, and surgery.',
        exampleSentence: 'Postoperative thrombosis prophylaxis is essential in high-risk surgical patients.',
        firstLetter: 'T'
    },
    {
        id: 'u-1',
        term: 'Ultrasound',
        pronunciation: '/ˈʌltrəsaʊnd/',
        partOfSpeech: 'noun',
        definition: 'A medical imaging technique that uses high-frequency sound waves to create images of internal body structures.',
        detailedExplanation: 'Ultrasound imaging (sonography) uses a transducer to emit sound waves and detect returning echoes, creating real-time images. It is safe, non-invasive, and radiation-free, making it ideal for pregnancy monitoring. Doppler ultrasound measures blood flow. Applications include abdominal imaging, cardiac echocardiography, musculoskeletal imaging, and guided procedures like biopsies. Limitations include poor visualization through bone or gas. Advances include 3D/4D imaging and contrast-enhanced ultrasound.',
        etymology: 'From Latin "ultra" meaning "beyond" + English "sound," referring to frequencies above human hearing range (>20,000 Hz).',
        synonyms: ['sonography', 'ultrasonography', 'echography', 'ultrasound imaging'],
        relatedTerms: ['Echocardiogram', 'Doppler', 'Transducer', 'Radiology'],
        category: 'Radiology',
        commonUsage: 'Widely used in obstetrics, cardiology, emergency medicine, and diagnostic imaging.',
        exampleSentence: 'The ultrasound revealed a gallstone in the common bile duct requiring surgical consultation.',
        firstLetter: 'U'
    },
    {
        id: 'v-1',
        term: 'Vaccine',
        pronunciation: '/ˈvæksiːn/',
        partOfSpeech: 'noun',
        definition: 'A biological preparation that provides active acquired immunity to a specific infectious disease.',
        detailedExplanation: 'Vaccines contain weakened or inactivated pathogens, pathogen parts (subunit vaccines), toxoids (inactivated toxins), or genetic material (mRNA vaccines). They stimulate the immune system to produce antibodies and memory cells without causing disease. Types include live attenuated, inactivated, subunit, conjugate, and nucleic acid vaccines. Vaccination is one of the most successful public health interventions, preventing millions of deaths annually from diseases like smallpox (eradicated), polio, measles, and COVID-19.',
        etymology: 'From Latin "vaccinus" meaning "from cows," from "vacca" meaning "cow," because the first vaccine (smallpox) used cowpox virus discovered by Edward Jenner (1796).',
        synonyms: ['inoculation', 'immunization', 'vaccination', 'biologic'],
        relatedTerms: ['Immunity', 'Antibody', 'Pathogen', 'Herd immunity'],
        category: 'Immunology',
        commonUsage: 'Essential for preventive medicine, pediatrics, and public health programs.',
        exampleSentence: 'The new mRNA vaccine demonstrated 95% efficacy in preventing symptomatic COVID-19 infection.',
        firstLetter: 'V'
    },
    {
        id: 'w-1',
        term: 'Wound',
        pronunciation: '/wuːnd/',
        partOfSpeech: 'noun',
        definition: 'An injury to living tissue, especially the skin, caused by various mechanisms including cuts, blows, or burns.',
        detailedExplanation: 'Wounds are classified as acute (surgical, traumatic) or chronic (pressure ulcers, diabetic foot ulcers, venous ulcers). The wound healing process involves hemostasis, inflammation, proliferation, and remodeling phases. Proper wound care prevents infection and promotes healing. Types include incisions (clean cuts), lacerations (torn tissue), abrasions (scrapes), punctures, and avulsions. Chronic wounds may require debridement, specialized dressings, negative pressure therapy, or hyperbaric oxygen.',
        etymology: 'Old English "wund" meaning "wound, injury, hurt," from Proto-Germanic "wundō" meaning "wound," from root meaning "to strike, wound."',
        synonyms: ['injury', 'trauma', 'lesion', 'laceration'],
        relatedTerms: ['Healing', 'Debridement', 'Suture', 'Bandage', 'Scar'],
        category: 'Surgery',
        commonUsage: 'Fundamental to emergency medicine, surgery, and wound care specialties.',
        exampleSentence: 'The surgical wound healed without signs of infection or dehiscence.',
        firstLetter: 'W'
    },
    {
        id: 'x-1',
        term: 'X-ray',
        pronunciation: '/ˈɛksreɪ/',
        partOfSpeech: 'noun/verb',
        definition: 'A form of electromagnetic radiation used to create images of the internal structures of the body.',
        detailedExplanation: 'X-rays were discovered by Wilhelm Röntgen in 1895. They pass through soft tissues but are absorbed by denser materials like bone, creating shadow images on photographic film or digital detectors. Common applications include detecting fractures, pneumonia, dental problems, and foreign objects. While generally safe, X-rays involve ionizing radiation, so exposure is minimized using lead shielding and limiting unnecessary studies. CT scans use multiple X-ray images to create cross-sectional views.',
        etymology: 'Named "X" by Wilhelm Röntgen (1895) because the nature of the rays was unknown; "X" represents an unknown quantity in mathematics.',
        synonyms: ['radiograph', 'roentgenogram', 'X-radiation', 'radiography'],
        relatedTerms: ['Radiology', 'CT scan', 'Fluoroscopy', 'Mammography'],
        category: 'Radiology',
        commonUsage: 'Most common medical imaging modality worldwide for skeletal and chest imaging.',
        exampleSentence: 'The chest X-ray showed bilateral infiltrates consistent with pneumonia.',
        firstLetter: 'X'
    },
    {
        id: 'y-1',
        term: 'Yeast Infection',
        pronunciation: '/jiːst ɪnˈfɛkʃən/',
        partOfSpeech: 'noun',
        definition: 'An infection caused by the overgrowth of Candida fungi, most commonly affecting moist areas of the body.',
        detailedExplanation: 'Candidiasis (yeast infection) is commonly caused by Candida albicans, a fungus normally present in the body. Risk factors include antibiotics, pregnancy, diabetes, immunosuppression, and hormonal changes. Vaginal yeast infections cause itching, burning, and discharge. Oral thrush appears as white patches in the mouth. Cutaneous candidiasis affects skin folds. Treatment includes topical or oral antifungals like fluconazole. Recurrent infections may indicate underlying conditions like diabetes or immunodeficiency.',
        etymology: '"Yeast" from Old English "gist, gyst" meaning "yeast, froth, sediment"; "infection" from Latin "infectio" meaning "a dyeing, tainting."',
        synonyms: ['candidiasis', 'thrush', 'moniliasis', 'fungal infection'],
        relatedTerms: ['Candida', 'Fungus', 'Antifungal', 'Thrush'],
        category: 'Infectious Disease',
        commonUsage: 'Common in primary care, gynecology, dermatology, and immunocompromised patients.',
        exampleSentence: 'The infant developed oral thrush, a yeast infection requiring antifungal treatment.',
        firstLetter: 'Y'
    },
    {
        id: 'z-1',
        term: 'Zoonosis',
        pronunciation: '/zoʊˈɒnəsɪs/',
        partOfSpeech: 'noun',
        definition: 'An infectious disease that can be transmitted from animals to humans.',
        detailedExplanation: 'Zoonotic diseases represent a significant proportion of human infectious diseases. Examples include rabies (from mammals), Lyme disease (ticks), salmonella (poultry/reptiles), West Nile virus (mosquitoes), and COVID-19 (suspected bat origin). Transmission can occur through direct contact, vectors, or contaminated food/water. Zoonoses are a major concern for public health due to potential for outbreaks. Veterinarians, farmers, and immunocompromised individuals are at higher risk.',
        etymology: 'From Greek "zōon" meaning "animal" + "nosos" meaning "disease," from "noseein" meaning "to be sick, suffer."',
        synonyms: ['zoonotic disease', 'animal-borne disease', 'anthropozoonosis'],
        relatedTerms: ['Vector-borne disease', 'One Health', 'Emerging infectious disease'],
        category: 'Public Health',
        commonUsage: 'Important in veterinary medicine, public health, and infectious disease surveillance.',
        exampleSentence: 'Rabies is a fatal zoonosis that requires immediate post-exposure prophylaxis.',
        firstLetter: 'Z'
    }
];
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const MedicalDictionary = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLetter, setSelectedLetter] = useState('A');
    const [selectedTerm, setSelectedTerm] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchHistory, setSearchHistory] = useState([]);
    const [bookmarkedTerms, setBookmarkedTerms] = useState(new Set());
    const searchRef = useRef(null);
    // Filter terms based on search
    const filteredTerms = useMemo(() => {
        if (!searchQuery.trim()) {
            return medicalTerms.filter(term => term.firstLetter === selectedLetter);
        }
        const query = searchQuery.toLowerCase();
        return medicalTerms.filter(term => term.term.toLowerCase().includes(query) ||
            term.definition.toLowerCase().includes(query) ||
            term.synonyms.some(s => s.toLowerCase().includes(query)));
    }, [searchQuery, selectedLetter]);
    // Get search suggestions
    const suggestions = useMemo(() => {
        if (!searchQuery.trim() || searchQuery.length < 1)
            return [];
        const query = searchQuery.toLowerCase();
        return medicalTerms
            .filter(term => term.term.toLowerCase().startsWith(query))
            .slice(0, 5);
    }, [searchQuery]);
    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    const handleSearch = (term) => {
        setSearchQuery(term);
        setShowSuggestions(false);
        const found = medicalTerms.find(t => t.term.toLowerCase() === term.toLowerCase());
        if (found) {
            setSelectedTerm(found);
            setSearchHistory(prev => [term, ...prev.filter(h => h !== term)].slice(0, 5));
        }
    };
    const toggleBookmark = (termId) => {
        setBookmarkedTerms(prev => {
            const newSet = new Set(prev);
            if (newSet.has(termId))
                newSet.delete(termId);
            else
                newSet.add(termId);
            return newSet;
        });
    };
    const clearSearch = () => {
        setSearchQuery('');
        setSelectedTerm(null);
        setShowSuggestions(false);
    };
    // Term Detail View
    if (selectedTerm) {
        return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-white border-b border-slate-200 sticky top-0 z-10", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsx("div", { className: "flex items-center gap-4", children: _jsxs("button", { onClick: () => setSelectedTerm(null), className: "flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors", children: [_jsx(ArrowLeft, { size: 20 }), _jsx("span", { children: "Back to Dictionary" })] }) }) }) }), _jsx("div", { className: "container mx-auto px-4 py-8 max-w-4xl", children: _jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white rounded-3xl shadow-lg overflow-hidden", children: [_jsx("div", { className: "p-8 bg-gradient-to-br from-blue-600 to-blue-700 text-white", children: _jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx("span", { className: "px-3 py-1 bg-white/20 rounded-full text-sm font-medium", children: selectedTerm.category }), _jsx("span", { className: "text-white/80 text-sm", children: selectedTerm.partOfSpeech })] }), _jsx("h1", { className: "text-4xl font-bold mb-2", children: selectedTerm.term }), selectedTerm.pronunciation && (_jsx("p", { className: "text-white/80 text-lg", children: selectedTerm.pronunciation }))] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => toggleBookmark(selectedTerm.id), className: `p-3 rounded-xl transition-colors ${bookmarkedTerms.has(selectedTerm.id)
                                                        ? 'bg-white text-blue-600'
                                                        : 'bg-white/20 text-white hover:bg-white/30'}`, children: _jsx(Bookmark, { size: 20, fill: bookmarkedTerms.has(selectedTerm.id) ? 'currentColor' : 'none' }) }), _jsx("button", { className: "p-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors", children: _jsx(Share2, { size: 20 }) })] })] }) }), _jsxs("div", { className: "p-8 space-y-8", children: [_jsxs("section", { children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2", children: [_jsx(BookOpen, { size: 20, className: "text-blue-600" }), "Definition"] }), _jsx("p", { className: "text-slate-700 text-lg leading-relaxed", children: selectedTerm.definition })] }), _jsxs("section", { children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2", children: [_jsx(Stethoscope, { size: 20, className: "text-blue-600" }), "Detailed Explanation"] }), _jsx("p", { className: "text-slate-600 leading-relaxed", children: selectedTerm.detailedExplanation })] }), _jsxs("section", { className: "bg-slate-50 rounded-2xl p-6", children: [_jsxs("h2", { className: "text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2", children: [_jsx(History, { size: 20, className: "text-amber-600" }), "Word Origin (Etymology)"] }), _jsx("p", { className: "text-slate-600 italic", children: selectedTerm.etymology })] }), _jsxs("div", { className: "grid md:grid-cols-2 gap-6", children: [_jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3", children: "Common Usage" }), _jsx("p", { className: "text-slate-600", children: selectedTerm.commonUsage })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3", children: "Example Sentence" }), _jsxs("p", { className: "text-slate-600 italic", children: ["\"", selectedTerm.exampleSentence, "\""] })] })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3", children: "Synonyms" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedTerm.synonyms.map((synonym, idx) => (_jsx("span", { className: "px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium", children: synonym }, idx))) })] }), _jsxs("section", { children: [_jsx("h3", { className: "text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3", children: "Related Medical Terms" }), _jsx("div", { className: "flex flex-wrap gap-2", children: selectedTerm.relatedTerms.map((term, idx) => (_jsx("button", { onClick: () => {
                                                        const found = medicalTerms.find(t => t.term === term);
                                                        if (found)
                                                            setSelectedTerm(found);
                                                    }, className: "px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-200 transition-colors", children: term }, idx))) })] })] })] }) })] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-slate-50", children: [_jsx("div", { className: "bg-gradient-to-br from-blue-600 to-blue-800 text-white", children: _jsx("div", { className: "container mx-auto px-4 py-16", children: _jsxs("div", { className: "text-center max-w-3xl mx-auto", children: [_jsxs("div", { className: "inline-flex items-center gap-2 px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6", children: [_jsx(BookOpen, { size: 16 }), _jsx("span", { children: "1,000+ Medical Terms" })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-bold mb-4", children: "Medical Dictionary" }), _jsx("p", { className: "text-lg text-blue-100 mb-8", children: "Comprehensive A-Z reference of medical terminology, definitions, etymology, and clinical usage" }), _jsxs("div", { ref: searchRef, className: "relative max-w-2xl mx-auto", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", value: searchQuery, onChange: (e) => {
                                                    setSearchQuery(e.target.value);
                                                    setShowSuggestions(true);
                                                }, onFocus: () => setShowSuggestions(true), placeholder: "Search medical terms, symptoms, conditions...", className: "w-full px-6 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 outline-none focus:ring-4 focus:ring-white/30" }), searchQuery && (_jsx("button", { onClick: clearSearch, className: "absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600", children: _jsx(X, { size: 20 }) }))] }), _jsx(AnimatePresence, { children: showSuggestions && suggestions.length > 0 && (_jsx(motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, className: "absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl overflow-hidden z-20", children: suggestions.map((term, idx) => (_jsxs("button", { onClick: () => handleSearch(term.term), className: "w-full px-4 py-3 text-left hover:bg-slate-50 transition-colors flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("span", { className: "font-semibold text-slate-900", children: term.term }), _jsx("span", { className: "text-sm text-slate-500 ml-2", children: term.category })] }), _jsx(ChevronRight, { size: 16, className: "text-slate-400" })] }, term.id))) })) })] }), searchHistory.length > 0 && !searchQuery && (_jsxs("div", { className: "mt-4 flex items-center justify-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm text-blue-200", children: "Recent:" }), searchHistory.map((term, idx) => (_jsx("button", { onClick: () => handleSearch(term), className: "text-sm text-white/80 hover:text-white underline", children: term }, idx)))] }))] }) }) }), _jsx("div", { className: "bg-white border-b border-slate-200 sticky top-0 z-10", children: _jsx("div", { className: "container mx-auto px-4 py-4", children: _jsx("div", { className: "flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide", children: alphabet.map(letter => (_jsx("button", { onClick: () => {
                                setSelectedLetter(letter);
                                setSearchQuery('');
                            }, className: `w-10 h-10 rounded-xl font-semibold text-sm transition-all flex-shrink-0 ${selectedLetter === letter && !searchQuery
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`, children: letter }, letter))) }) }) }), _jsxs("div", { className: "container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h2", { className: "text-xl font-bold text-slate-900", children: searchQuery ? `Search Results for "${searchQuery}"` : `Terms Starting with ${selectedLetter}` }), _jsxs("span", { className: "text-slate-500", children: [filteredTerms.length, " terms found"] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: _jsx(AnimatePresence, { mode: "popLayout", children: filteredTerms.map((term, index) => (_jsxs(motion.div, { layout: true, initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: { delay: index * 0.03 }, onClick: () => setSelectedTerm(term), className: "group bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors", children: term.term }), term.pronunciation && (_jsx("p", { className: "text-sm text-slate-400", children: term.pronunciation }))] }), _jsx("span", { className: "px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg", children: term.category })] }), _jsx("p", { className: "text-slate-600 text-sm line-clamp-2 mb-4", children: term.definition }), _jsxs("div", { className: "flex items-center text-blue-600 text-sm font-medium", children: [_jsx("span", { children: "View Definition" }), _jsx(ChevronRight, { size: 16, className: "group-hover:translate-x-1 transition-transform" })] })] }, term.id))) }) }), filteredTerms.length === 0 && (_jsxs("div", { className: "text-center py-16", children: [_jsx("div", { className: "w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx(Search, { size: 32, className: "text-slate-400" }) }), _jsx("h3", { className: "text-lg font-semibold text-slate-900 mb-2", children: "No terms found" }), _jsx("p", { className: "text-slate-500", children: "Try searching with different keywords" })] }))] })] }));
};
export default MedicalDictionary;
//# sourceMappingURL=MedicalDictionary.js.map