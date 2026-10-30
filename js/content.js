/* ─────────────────────────────────────────────────────────────────────────
   ViStA Lab — site content.
   Everything the page shows lives in this one file. Edit, save, refresh.

   Optional: paste "Publish to web → CSV" links from Google Sheets into
   `sheets` below and that sheet replaces the matching list at load time.
   Column names are the same ones the previous site used
   (publications: title, authors, venue, year, doi · team: name, role, title,
   image, email, order · opportunities: title, type, deadline, description,
   contact). Multi-value cells are semicolon separated.
   ───────────────────────────────────────────────────────────────────────── */
window.VISTA = {
  sheets: {
    publications: '',
    team: '',
    opportunities: '',
  },

  lab: {
    name: 'ViStA Lab',
    professor: 'Prof. Dr. Sumit Biswas',
    university: 'BITS Pilani, K K Birla Goa Campus',
    department: 'Department of Biological Sciences',
    email: 'sumit@goa.bits-pilani.ac.in',
    address: 'B-109, BITS Pilani, K K Birla Goa Campus, Goa 403726',
    coords: '15.3896° N, 73.8743° E',
    map: 'https://www.google.com/maps/search/?api=1&query=BITS+Pilani+K+K+Birla+Goa+Campus',
    scholar: 'https://scholar.google.com/citations?user=zXYahOYAAAAJ&hl=en',
  },

  // How many of the most recent publications to list before the Google Scholar link.
  recentPublications: 6,

  // The four hero stages — one per particle sculpture.
  stages: [
    { key: 'Vi', word: 'Vibrio', line: 'It began with one bacterium — a lab devoted to the Vibrio lifestyle.' },
    { key: 'St', word: 'Structure', line: 'Protein–protein, protein–nucleotide and miRNA interactions, resolved in structural detail.' },
    { key: 'A', word: 'Analysis', line: 'AI and machine learning, put to work on biological discovery.' },
    { key: 'Lab', word: 'and out to sea', line: 'Marine biology, ancient lineages and the microplastics now drifting among them.' },
  ],

  manifesto:
    'The ViStA Lab is a melting pot of ideas and innovation. Though it debuted as a lab devoted to Vibrio lifestyle and structural analysis, it has grown along multiple correlated dimensions.',
  about:
    'Today our work spans AI & machine learning for biological discovery, protein engineering, proteomics, marine biology, and the emerging threat of microplastics on marine ecosystems — united by a commitment to rigorous, curiosity-driven science at BITS Pilani, K K Birla Goa Campus.',

  marquee: [
    'Protein Engineering', 'Proteomics', 'Marine Biology', 'Microplastics', 'Biofilms',
    'Antimicrobial Resistance', 'Structural Biology', 'AI-driven Drug Discovery', 'Marine Conservation',
  ],

  research: [
    {
      scene: 'fold',
      title: 'AI/ML — Protein Engineering',
      desc: 'Rational design and directed evolution of proteins for industrial and therapeutic use.',
      tags: ['Machine learning', 'Rational design', 'Directed evolution'],
    },
    {
      scene: 'spectrum',
      title: 'Proteomics',
      desc: 'Large-scale characterisation of proteomes under stress, infection and environmental cues.',
      tags: ['Stress', 'Infection', 'Environmental cues'],
    },
    {
      scene: 'tide',
      title: 'Marine Biology',
      desc: 'Marine microbial ecology, biodiversity and organism–environment interactions.',
      tags: ['Microbial ecology', 'Biodiversity', 'Tachypleus gigas'],
    },
    {
      scene: 'plastic',
      title: 'Microplastics',
      desc: 'Impact of microplastic pollutants on marine microbiomes and ecosystem health.',
      tags: ['Pollutants', 'Marine microbiomes', 'Ecosystem health'],
    },
  ],

  footage: [
    {
      tag: 'Developmental Biology',
      title: 'Embryo Development',
      text: 'Time-lapse documentation of horseshoe crab embryo development, revealing conserved patterns across ancient lineages.',
      video: 'assets/video/vid2.mp4',
      poster: 'assets/video/vid2.jpg',
    },
    {
      tag: 'Marine Biology',
      title: 'Horseshoe Crab Hatching',
      text: 'Witnessing the emergence of Tachypleus gigas from its egg — a window into one of nature\'s oldest life forms.',
      video: 'assets/video/vid1.mp4',
      poster: 'assets/video/vid1.jpg',
    },
  ],

  featured: {
    label: 'Recent publication',
    title: 'Identification of prospective PETases across prokaryotes using an in silico approach',
    text: 'Structural insights into plastic-degrading enzymes.',
    authors: 'Yashkumar Rathod, Sumit Biswas',
    venue: 'BMC Biology',
    year: 2026,
    doi: '10.1186/s12915-026-02548-0',
    image: 'assets/petase.webp',
  },

  // Source: Prof. Biswas's Google Scholar profile (read 6 Oct 2026), limited to the
  // lab's own papers — the profile also lists work by other authors named S. Biswas.
  // Rows without a DOI link to a Google Scholar search for the title.
  publications: [
    { year: 2026, venue: 'Microbial Pathogenesis', title: 'Surface-associated phosphoglycerate kinase (PGK) of Staphylococcus aureus binds human plasminogen in a partially lysine-independent manner', authors: 'Rizelia Christina Rodrigues, Yashkumar Rathod, Sumit Biswas, Malabika Biswas', doi: '10.1016/j.micpath.2026.108762' },
    { year: 2026, venue: 'Recent Patents on Biotechnology', title: 'Technologies for conservation of horseshoe crabs: a patent landscape analysis', authors: 'U Mallick, S Biswas', doi: '' },
    { year: 2026, venue: 'BMC Biology', title: 'Identification of prospective PETases across prokaryotes using an in silico approach', authors: 'Yashkumar Rathod, Sumit Biswas', doi: '10.1186/s12915-026-02548-0' },
    { year: 2026, venue: 'Journal of Conservative Dentistry and Endodontics', title: 'Efficacy of nonantimicrobial drugs against Enterococcus faecalis using confocal laser scanning microscopy – an in vitro study', authors: 'Twyla Maria Christa Ferrao, Ida De Noronha De Ataide, Rajan Lambor, Shashank Kashyap, Sumit Biswas, Komal S Salkar, Lakshangy S Charya', doi: '10.4103/JCDE.JCDE_1008_25' },
    { year: 2026, venue: 'RSC Medicinal Chemistry', title: 'Microwave-assisted single-step synthesis of cyclic and acyclic β-aminosulfones and evaluation of their antifungal activity targeting CYP51', authors: 'Abigail Bibiana Pinheiro, Soumik Saha, Madhuri Madduri, Utpal Roy, Lakshmi Sudhir Menon, Sumit Biswas, Amrita Chatterjee, Mainak Banerjee', doi: '10.1039/d5md00907c' },
    { year: 2026, venue: 'International Journal of Biomaterials', title: 'Effect of Moringa oleifera protein-coated gold nanoparticles as naturally derived disruptors of biofilms', authors: 'Lakshmi Sudhir Menon, Narendranath Ghosh, Sumit Biswas', doi: '10.1155/ijbm/1381604' },
    { year: 2026, venue: 'bioRxiv (preprint)', title: 'Microscale assay to evaluate the minimum inhibitory concentration of purified compounds with limited sample volume', authors: 'S Kashyap, S Biswas', doi: '' },
    { year: 2025, venue: 'Frontiers in Marine Science', title: 'An insight into the development stages and proteome of the early-stage embryo in the horseshoe crab species T. gigas', authors: 'U Mallick, Y Rathod, S Biswas', doi: '' },
    { year: 2025, venue: 'Scientific Reports', title: 'Murraya koenigii methanolic extract inhibits bacterial growth and biofilm of Staphylococcus aureus and Enterococcus faecalis', authors: 'Shashank Kashyap, Yashkumar Rathod, Sumit Biswas', doi: '10.1038/s41598-025-14396-z' },
    { year: 2025, venue: 'ACS Infectious Diseases', title: 'Staphylococcal functional amyloids: structure, pathogenic roles, biofilm fortification, and inhibition strategies', authors: 'N Admane, S Biswas', doi: '' },
    { year: 2024, venue: 'Scientific Reports', title: 'Amyloid transformations of phenol soluble modulin α1 in Staphylococcus aureus and their modulation deploying a prenylated chalcone', authors: 'Nikita Admane, Ram Kothandan, Sumit Biswas', doi: '10.1038/s41598-024-69344-0' },
    { year: 2024, venue: 'RNA-based Mechanisms in Cancer (book chapter)', title: 'miRNA-based therapeutic strategies', authors: 'S Biswas, L Menon', doi: '' },
    { year: 2023, venue: 'Molecular Biotechnology', title: 'Identification and preliminary characterization of a novel single-stranded DNA binding protein of Staphylococcus aureus phage Phi11 expressed in Escherichia coli', authors: 'Vivek Ratre, Vijay Hemmadi, Sumit Biswas, Malabika Biswas', doi: '10.1007/s12033-022-00598-7' },
    { year: 2023, venue: 'Journal of Biomolecular Structure and Dynamics', title: 'A quinoline alkaloid potentially modulates the amyloidogenic structural transitions of the biofilm scaffolding small basic protein', authors: 'N Admane, R Kothandan, S Syed, S Biswas', doi: '' },
    { year: 2023, venue: 'Protein and Peptide Letters', title: 'Disruption of Staphylococcus aureus biofilms with purified Moringa oleifera leaf extract protein', authors: 'L Menon, O Chouhan, R Walke, S Shah, S Damare, S Biswas', doi: '' },
    { year: 2022, venue: 'Frontiers in Marine Science', title: 'Plastic filtration and decomposition according to ricochet filtering mechanism using Ideonella sakaiensis', authors: 'P Sankrityayan, S Biswas', doi: '' },
    { year: 2021, venue: 'ICAECT 2021 (conference)', title: 'MicRooN – an ensemble-based classifier for identifying miRNAs associated with cancer', authors: 'R Kothandan, S Biswas', doi: '' },
    { year: 2021, venue: 'International Journal of Legal Medicine', title: 'Genomic insight into Y-STR diversity in the population of Odisha, India', authors: 'S Sahoo, R Samal, S Behera, S Biswas, S Dixit, RK Kumawat, G Chaubey, et al.', doi: '' },
    { year: 2021, venue: 'Forensic Science International', title: 'Efficacy of a novel bone preprocessing method for better DNA yield', authors: 'Subhasish Sahoo, Rashmita Samal, Sumit Biswas', doi: '10.1016/j.forsciint.2021.110887' },
    { year: 2021, venue: 'Sensors and Actuators B: Chemical', title: 'A redox-coupled carbon dots-MnO2 nanosheets based sensory platform for label-free and sensitive detection of E. coli', authors: 'SD Hiremath, AA Bhosle, A Nayse, S Biswas, M Biswas, AC Bhasikuttan, et al.', doi: '' },
    { year: 2021, venue: 'Biophysical Chemistry', title: 'N-terminal truncation of VC0395_0300 protein from Vibrio cholerae does not lead to loss of diguanylate cyclase activity', authors: 'Divya Bandekar, Swati Mohapatra, Mousumi Hazra, Saugata Hazra, Sumit Biswas', doi: '10.1016/j.bpc.2020.106493' },
    { year: 2020, venue: 'Frontiers in Cellular and Infection Microbiology', title: 'Diguanylate cyclases in Vibrio cholerae: essential regulators of lifestyle switching', authors: 'S Biswas, OP Chouhan, D Bandekar', doi: '' },
    { year: 2020, venue: 'International Journal of Legal Medicine', title: 'Genomic portrait of Odisha, India drawn by using 21 autosomal STR markers', authors: 'S Sahoo, R Samal, S Behera, AK Swain, S Biswas, P Shrivastava, et al.', doi: '' },
    { year: 2020, venue: 'Biochemical and Biophysical Research Communications', title: 'Structure of the active GGEEF domain of a diguanylate cyclase from Vibrio cholerae', authors: 'Om Prakash Chouhan, Yvette Roske, Udo Heinemann, Sumit Biswas', doi: '10.1016/j.bbrc.2019.11.179' },
    { year: 2019, venue: 'Journal of Biosciences', title: 'Effect of ions and inhibitors on the catalytic activity and structural stability of S. aureus enolase', authors: 'V Hemmadi, A Das, OP Chouhan, S Biswas, M Biswas', doi: '' },
    { year: 2018, venue: 'Journal of Biological Inorganic Chemistry', title: 'DNA binding, cleavage and cytotoxicity studies of three mononuclear Cu(II) chloro-complexes containing N-S donor Schiff base ligands', authors: 'Sidhali U Parsekar, Joseph Fernandes, Arnab Banerjee, Om Prakash Chouhan, Sumit Biswas, Manohar Singh, Durga P Mishra, Manjuri Kumar', doi: '10.1007/s00775-018-1620-2' },
    { year: 2018, venue: 'Current Topics in Medicinal Chemistry', title: 'MicroRNAs as therapeutic agents: the future of the battle against cancer', authors: 'S Biswas', doi: '' },
    { year: 2018, venue: 'Protein and Peptide Letters', title: 'Subtle changes due to mutations in the GGDEF domain result in loss of biofilm forming activity in the VC0395_0300 protein from Vibrio cholerae…', authors: 'OP Chouhan, S Biswas', doi: '' },
    { year: 2018, venue: 'The Open Microbiology Journal', title: 'Expression of Phi11 Gp07 causes filamentation in Escherichia coli', authors: 'Avijit Das, Sumit Biswas, Malabika Biswas', doi: '10.2174/1874285801812010107' },
    { year: 2017, venue: 'Microbiological Research', title: 'Putative protein VC0395_0300 from Vibrio cholerae is a diguanylate cyclase with a role in biofilm formation', authors: 'Divya Bandekar, Om Prakash Chouhan, Swati Mohapatra, Mousumi Hazra, Saugata Hazra, Sumit Biswas', doi: '10.1016/j.micres.2017.05.003' },
    { year: 2017, venue: 'Inorganica Chimica Acta', title: 'Spectroscopic, electrochemical and DNA binding studies of some monomeric copper(II) complexes containing N2S(thiolate)Cu core and N4S(disulfide)Cu core', authors: 'MK Koley, OP Chouhan, S Biswas, J Fernandes, A Banerjee, et al.', doi: '' },
    { year: 2016, venue: 'Current Bioinformatics', title: 'Comparison of kernel and decision tree-based algorithms for the prediction of microRNAs associated with cancer', authors: 'R Kothandan, S Biswas', doi: '' },
    { year: 2016, venue: 'AMB Express', title: 'Effect of site-directed mutagenesis at the GGEEF domain of the biofilm forming GGEEF protein from Vibrio cholerae', authors: 'Om Prakash Chouhan, Divya Bandekar, Mousumi Hazra, Ashish Baghudana, Saugata Hazra, Sumit Biswas', doi: '10.1186/s13568-015-0168-6' },
    { year: 2016, venue: 'Protein and Peptide Letters', title: 'Analysis of interactions and dissection of interfaces involved in RNA-protein recognition', authors: 'Sumit Biswas, Pinak Chakrabarti', doi: '10.2174/0929866522666150115112654' },
    { year: 2015, venue: 'Computational Biology and Chemistry', title: 'Identifying microRNAs involved in cancer pathway using support vector machines', authors: 'Ram Kothandan, Sumit Biswas', doi: '10.1016/j.compbiolchem.2015.01.007' },
    { year: 2014, venue: 'Indian Journal of Pharmaceutical Sciences', title: 'Identification of a proteinaceous component in the leaf of Moringa oleifera Lam. with effects on high serum creatinine', authors: 'S Sahoo, KM Raghavendra, S Biswas', doi: '' },
    { year: 2013, venue: 'Bioinformation', title: 'Search for signatures in miRNAs associated with cancer', authors: 'R Kothandan, S Biswas', doi: '' },
    { year: 2012, venue: 'Toxicon', title: 'Anticoagulant activity of Moon jellyfish (Aurelia aurita) tentacle extract', authors: 'A Rastogi, S Biswas, A Sarkar, D Chakrabarty', doi: '' },
    { year: 2011, venue: 'Bioinformation', title: 'Sequence trademarks in oncogene associated microRNAs', authors: 'S Sharma, S Biswas', doi: '' },
    { year: 2010, venue: 'Toxicon', title: 'A lethal cardiotoxic–cytotoxic protein from the Indian monocellate cobra (Naja kaouthia) venom', authors: 'A Debnath, A Saha, A Gomes, S Biswas, P Chakrabarti, B Giri, AK Biswas, et al.', doi: '' },
    { year: 2009, venue: 'Proteins: Structure, Function, and Bioinformatics', title: 'Dissection, residue conservation, and structural classification of protein-DNA interfaces', authors: 'S Biswas, M Guharoy, P Chakrabarti', doi: '' },
    { year: 2008, venue: 'Bioinformation', title: 'Structural segments and residue propensities in protein-RNA interfaces: comparison with protein-protein and protein-DNA complexes', authors: 'S Biswas, M Guharoy, P Chakrabarti', doi: '' },
  ],

  pi: {
    name: 'Prof. Dr. Sumit Biswas',
    role: 'Principal Investigator',
    title: 'Department of Biological Sciences · BITS Pilani, K K Birla Goa Campus',
    email: 'sumit@goa.bits-pilani.ac.in',
    image: 'assets/team/pi_sb.webp',
  },

  // `role` is left blank where the old site's sheet was not available — fill in.
  team: [
    { name: 'Yashkumar Rathod', role: '', image: 'assets/team/yashkumar.webp' },
    { name: 'Shashank', role: '', image: 'assets/team/shashank.webp' },
    { name: 'Nikita', role: '', image: 'assets/team/nikita.webp' },
    { name: 'Utpal', role: '', image: 'assets/team/utpal.webp' },
    { name: 'Vrunda', role: '', image: 'assets/team/vrunda.webp' },
    { name: 'Akhilesh Upadhyay', role: '', image: 'assets/team/member-8.webp' },
    { name: 'Vinayak', role: '', image: 'assets/team/vinayak.webp' },
  ],

  alumni: [
    { name: 'Dr. Omprakash Chauhan', image: 'assets/team/omprakash.webp' },
    { name: 'Dr. Ram K', image: 'assets/team/ram.webp' },
    { name: 'Dr. Vivek Ratre', image: 'assets/team/vivek.webp' },
    { name: 'Dr. Lakshmi Menon', image: 'assets/team/lakshmi.webp' },
  ],

  join: {
    title: 'Interested in working with us?',
    text: 'Open positions for PhD students, postdocs, and interns. Competitive funding and a collaborative, publication-driven environment.',
    fallbackTitle: 'Don\'t see a matching position?',
    fallback: 'We welcome motivated researchers who align with our mission. Send your CV and a brief research statement.',
    image: '', // optional photo beside the text
  },

  // Filled from the opportunities sheet when one is configured.
  opportunities: [],

  contact: {
    text: 'Whether you have a research question, collaboration idea, or application inquiry — we\'d love to hear from you.',
  },
};
