-- Retour arrière SMI uniquement, après sauvegarde des cinq tables SMI.
-- Déployer d'abord une version sans SMI. Ne pas exécuter automatiquement.
-- Les documents, versions et fichiers GED sont volontairement conservés.
DROP TABLE IF EXISTS smi_evidence_links;
DROP TABLE IF EXISTS smi_document_links;
DROP TABLE IF EXISTS smi_events;
DROP TABLE IF EXISTS smi_requirements;
DROP TABLE IF EXISTS smi_standards;
