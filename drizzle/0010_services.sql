-- Les services structurent les tableaux. Les unités de travail restent dans le DUERP.
UPDATE teams SET name='Fabrication' WHERE id='production' AND name='Production';
--> statement-breakpoint
UPDATE teams SET name='R&D TAF / PP' WHERE id='rd' AND name='R&D';
--> statement-breakpoint
INSERT OR IGNORE INTO teams (id,name,rank,parent_id,revision) VALUES
  ('commercial','Commercial',2,'direction',1),
  ('planification','Planification',2,'direction',1),
  ('laboratoire','Laboratoire',2,'direction',1),
  ('logistique','Logistique',2,'direction',1),
  ('travaux-neufs','Travaux neufs',2,'direction',1),
  ('achats','Achats',2,'direction',1),
  ('procedes','Procédés',2,'direction',1),
  ('maintenance','Maintenance',2,'direction',1),
  ('informatique','Informatique',2,'direction',1);
--> statement-breakpoint
INSERT OR IGNORE INTO team_dashboards (id,team_id,unit_code,data,revision,updated_at,updated_by)
SELECT 'board-' || id,id,'',json_object('title','Point ' || name,'widgets',json('[]')),1,'',''
FROM teams WHERE id IN ('commercial','planification','laboratoire','logistique','travaux-neufs','achats','procedes','maintenance','informatique');
