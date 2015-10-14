package jmc.trazaweb;

// Generated 07-may-2015 12:44:04 by Hibernate Tools 3.4.0.CR1

import java.util.List;
import javax.naming.InitialContext;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.LockMode;
import org.hibernate.SessionFactory;
import static org.hibernate.criterion.Example.create;

/**
 * Home object for domain model class ArtDespa.
 * @see jmc.trazaweb.ArtDespa
 * @author Hibernate Tools
 */
public class ArtDespaHome {

	private static final Log log = LogFactory.getLog(ArtDespaHome.class);

	private final SessionFactory sessionFactory = getSessionFactory();

	protected SessionFactory getSessionFactory() {
		try {
			return (SessionFactory) new InitialContext()
					.lookup("SessionFactory");
		} catch (Exception e) {
			log.error("Could not locate SessionFactory in JNDI", e);
			throw new IllegalStateException(
					"Could not locate SessionFactory in JNDI");
		}
	}

	public void persist(ArtDespa transientInstance) {
		log.debug("persisting ArtDespa instance");
		try {
			sessionFactory.getCurrentSession().persist(transientInstance);
			log.debug("persist successful");
		} catch (RuntimeException re) {
			log.error("persist failed", re);
			throw re;
		}
	}

	public void attachDirty(ArtDespa instance) {
		log.debug("attaching dirty ArtDespa instance");
		try {
			sessionFactory.getCurrentSession().saveOrUpdate(instance);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void attachClean(ArtDespa instance) {
		log.debug("attaching clean ArtDespa instance");
		try {
			sessionFactory.getCurrentSession().lock(instance, LockMode.NONE);
			log.debug("attach successful");
		} catch (RuntimeException re) {
			log.error("attach failed", re);
			throw re;
		}
	}

	public void delete(ArtDespa persistentInstance) {
		log.debug("deleting ArtDespa instance");
		try {
			sessionFactory.getCurrentSession().delete(persistentInstance);
			log.debug("delete successful");
		} catch (RuntimeException re) {
			log.error("delete failed", re);
			throw re;
		}
	}

	public ArtDespa merge(ArtDespa detachedInstance) {
		log.debug("merging ArtDespa instance");
		try {
			ArtDespa result = (ArtDespa) sessionFactory.getCurrentSession()
					.merge(detachedInstance);
			log.debug("merge successful");
			return result;
		} catch (RuntimeException re) {
			log.error("merge failed", re);
			throw re;
		}
	}

	public ArtDespa findById(jmc.trazaweb.ArtDespaId id) {
		log.debug("getting ArtDespa instance with id: " + id);
		try {
			ArtDespa instance = (ArtDespa) sessionFactory.getCurrentSession()
					.get("jmc.trazaweb.ArtDespa", id);
			if (instance == null) {
				log.debug("get successful, no instance found");
			} else {
				log.debug("get successful, instance found");
			}
			return instance;
		} catch (RuntimeException re) {
			log.error("get failed", re);
			throw re;
		}
	}

	public List<ArtDespa> findByExample(ArtDespa instance) {
		log.debug("finding ArtDespa instance by example");
		try {
			List<ArtDespa> results = (List<ArtDespa>) sessionFactory
					.getCurrentSession()
					.createCriteria("jmc.trazaweb.ArtDespa")
					.add(create(instance)).list();
			log.debug("find by example successful, result size: "
					+ results.size());
			return results;
		} catch (RuntimeException re) {
			log.error("find by example failed", re);
			throw re;
		}
	}
}
