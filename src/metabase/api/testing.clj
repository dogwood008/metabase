(ns metabase.api.testing
  "Endpoints for testing."
  (:require [clojure.java.jdbc :as jdbc]
            [clojure.string :as str]
            [clojure.tools.logging :as log]
            [compojure.core :refer [POST]]
            [metabase.api.common :as api]
            [metabase.models.setting.cache :as setting.cache]
            [toucan.db :as db]))

(defn- snapshot-path-for-name
  ^String [snapshot-name]
  (str "frontend/test/snapshots/" (str/replace (name snapshot-name) #"\W" "_") ".sql"))

(defn- save-snapshot! [snapshot-name]
  (let [path (snapshot-path-for-name snapshot-name)]
    (log/infof "Saving snapshot to %s" path)
    (jdbc/query (db/connection) ["SCRIPT TO ?" path]))
  :ok)

(defn- restore-snapshot! [snapshot-name]
  (let [path (snapshot-path-for-name snapshot-name)]
    (log/infof "Restoring snapshot from %s" path)
    (api/check-404 (.exists (java.io.File. path)))
    (with-open [conn (jdbc/get-connection (db/connection))]
      (let [conn-spec {:connection conn}]
        (jdbc/execute! conn-spec ["SET LOCK_TIMEOUT 180000"])
        (jdbc/execute! conn-spec ["DROP ALL OBJECTS"])
        (jdbc/execute! conn-spec ["RUNSCRIPT FROM ?" path]))))
  (setting.cache/restore-cache!)
  :ok)

(api/defendpoint POST "/snapshot/:name"
  "Snapshot the database for testing purposes."
  [name]
  (save-snapshot! name)
  nil)

(api/defendpoint POST "/restore/:name"
  "Restore a database snapshot for testing purposes."
  [name]
  (restore-snapshot! name)
  nil)

(api/defendpoint POST "/echo"
  [fail :as {:keys [body]}]
  (if fail
    {:status 400
     :body {:error-code "oops"}}
    {:status 200
     :body body}))

(api/define-routes)
